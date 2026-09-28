import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, storeId, quantity } = req.body;

    if (!productId || !storeId || !quantity) {
      return res
        .status(400)
        .json({ message: "Please provide productId, storeId, quantity" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (product.stockCount < quantity) {
      return res.status(400).json({
        message: `Order failed: Not enough stock. Only ${product.stockCount} left on the shelf...`,
      });
    }

    product.stockCount = product.stockCount - quantity;
    await product.save();

    const newOrder = await Order.create({
      productId,
      storeId,
      quantity,
    });

    res.status(201).json(newOrder);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed to process order", error: e.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("productId", "name price")
      .populate("storeId", "name location");

    res.status(200).json(orders);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: e.message });
  }
};
