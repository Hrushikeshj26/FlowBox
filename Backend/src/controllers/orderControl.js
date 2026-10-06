import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Store from "../models/Store.js"; // Assuming your warehouse model is Store.js

// CREATE ORDER & DEDUCT STOCK
export const createOrder = async (req, res, next) => {
  try {
    const { customerName, productId, quantity } = req.body;

    if (!customerName || !productId || !quantity) {
      return res.status(400).json({
        message: "Please provide customer name, product, and quantity.",
      });
    }

    // 1. Find the product to check stock and get the price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // 2. Check if we have enough stock
    if (product.stockCount < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Only ${product.stockCount} left.`,
      });
    }

    // 3. Calculate total price on the backend (prevents frontend spoofing)
    const totalPrice = product.price * quantity;

    // 4. Create the Order
    const newOrder = await Order.create({
      customerName,
      product: productId,
      quantity,
      totalPrice,
    });

    // 5. Deduct stock from the Product
    await Product.findByIdAndUpdate(productId, {
      $inc: { stockCount: -quantity },
    });

    // 6. Deduct load from the Warehouse
    if (product.storeId) {
      await Store.findByIdAndUpdate(product.storeId, {
        $inc: { currentLoad: -quantity },
      });
    }

    res
      .status(201)
      .json({ message: "Order placed successfully", data: newOrder });
  } catch (err) {
    next(err);
  }
};

// GET ALL ORDERS (Populated with Product details)
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("product", "name price") // Pulls the product name and price into the order response
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    next(err);
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
