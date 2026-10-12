import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js";

// GET ALL ORDERS FOR LOGGED-IN USER (Populated with Product details)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

// POST /api/orders (Create order for logged-in user)
export const createOrder = async (req, res) => {
  const { customerName, customerEmail, customerPhone, productId, quantity } =
    req.body;

  try {
    // Only allow ordering from the logged-in user's own products
    const product = await Product.findOne({
      _id: productId,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stockCount < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const totalPrice = product.price * quantity;

    const newOrder = new Order({
      user: req.user._id, // Link order to logged-in user
      customerName,
      customerEmail,
      customerPhone,
      productId,
      quantity: Number(quantity),
      totalPrice,
    });

    await newOrder.save();

    // Deduct stock from product
    product.stockCount -= Number(quantity);
    await product.save();

    // Deduct load from warehouse if assigned
    if (product.storeId) {
      await Store.findOneAndUpdate(
        { _id: product.storeId, user: req.user._id },
        { $inc: { currentLoad: -Number(quantity) } },
      );
    }

    // Populate product details before returning to frontend
    const populatedOrder = await Order.findById(newOrder._id).populate(
      "productId",
    );

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Create Order Error:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

// DELETE ORDER & RESTORE STOCK (Scoped to logged-in user)
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure user can only delete their own order
    const deletedOrder = await Order.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Restore stock back to the product
    const targetProductId = deletedOrder.productId || deletedOrder.product;
    const product = await Product.findOne({
      _id: targetProductId,
      user: req.user._id,
    });

    if (product) {
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stockCount: deletedOrder.quantity },
      });

      // Add load back to warehouse
      if (product.storeId) {
        await Store.findOneAndUpdate(
          { _id: product.storeId, user: req.user._id },
          { $inc: { currentLoad: deletedOrder.quantity } },
        );
      }
    }

    res.status(200).json({ message: "Order deleted and stock restored." });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

// UPDATE ORDER STATUS (Scoped to logged-in user)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, user: req.user._id }, // Ensure user owns the order
      { status },
      { new: true },
    ).populate("productId");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ message: "Status updated", data: updatedOrder });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};
