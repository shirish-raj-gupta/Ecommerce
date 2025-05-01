import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
import crypto from "crypto";

//global variables
const currency = "INR"; //change to dynamic currency if needed
const deliveryCharges = 10; //change to dynamic delivery charges if needed

//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

//PLACE ORDER using cod
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { $set: { cartData: {} } });
    res.status(200).json({ message: "Order placed successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//PLACE ORDER using stripe
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency, // change to dynamic currency if needed
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects amount in cents
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency, // change to dynamic currency if needed
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100, // Stripe expects amount in cents
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.status(200).json({ session_url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//verify stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { $set: { cartData: {} } });
      res.status(200).json({ message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(200).json({ message: "Payment failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: "INR", // Or currency.toUpperCase() if dynamic
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await new Promise((resolve, reject) => {
      razorpayInstance.orders.create(options, (error, order) => {
        if (error) {
          return reject(error);
        }
        resolve(order);
      });
    });

    return res
      .status(200)
      .json({ order: razorpayOrder, orderId: newOrder._id });
  } catch (err) {
    console.log("Error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // order_id was used as receipt (MongoDB _id), so extract it
    const receiptId = razorpay_order_id.split("_").pop(); // assuming this was embedded
    const updatedOrder = await orderModel.findByIdAndUpdate(receiptId, {
      payment: true,
    });

    await userModel.findByIdAndUpdate(userId, { $set: { cartData: {} } });

    res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    console.log("Verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//all orders for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user order  for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.status(200).json({ orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update order status for admin panel
const updateSatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateSatus,
  verifyStripe,
  verifyRazorpay,
};
