import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js"; // Assuming your warehouse model is Store.js

// GET ALL ORDERS (Populated with Product details)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("productId");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

// POST /api/orders
export const createOrder = async (req, res) => {
  const { customerName, customerEmail, customerPhone, productId, quantity } =
    req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stockCount < quantity)
      return res.status(400).json({ message: "Insufficient stock" });

    const totalPrice = product.price * quantity;

    const newOrder = new Order({
      customerName,
      customerEmail,
      customerPhone,
      productId,
      quantity,
      totalPrice,
    });

    await newOrder.save();

    product.stockCount -= quantity;
    await product.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};

// DELETE ORDER & RESTORE STOCK
export const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    // If an order is deleted/cancelled, we should put the stock back!
    const product = await Product.findById(deletedOrder.product);

    if (product) {
      // Add stock back to product
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stockCount: deletedOrder.quantity },
      });

      // Add load back to warehouse
      if (product.storeId) {
        await Store.findByIdAndUpdate(product.storeId, {
          $inc: { currentLoad: deletedOrder.quantity },
        });
      }
    }

    res.status(200).json({ message: "Order deleted and stock restored." });
  } catch (err) {
    next(err);
  }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }, // Returns the newly updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Status updated", data: updatedOrder });
  } catch (err) {
    next(err);
  }
};
