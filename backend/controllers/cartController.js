import userModel from "../models/userModel.js";

//add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);

    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {};

    // Initialize item entry if it doesn't exist
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // Initialize size quantity or increment
    if (cartData[itemId][size]) {
      cartData[itemId][size] += 1;
    } else {
      cartData[itemId][size] = 1;
    }

    // Save updated cartData to user document
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (err) {
    console.error("Error in addToCart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update products to user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;
    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.status(200).json({ message: "Product updated to cart successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get user products to user cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;
    res.status(200).json({ cartData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addToCart, updateCart, getUserCart };
