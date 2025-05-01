import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateSatus,
  verifyStripe,
  verifyRazorpay,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

//admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateSatus);

//payment features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/place/stripe", authUser, placeOrderStripe);
orderRouter.post("/place/razorpay", authUser, placeOrderRazorpay);

//user features
orderRouter.post("/userorders", authUser, userOrders);

//verify payment for stripe
orderRouter.post("/verifystripe", authUser, verifyStripe);

//verify payment for razorpay
orderRouter.post("/verifyrazorpay", authUser, verifyRazorpay);

export default orderRouter;
