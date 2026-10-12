import Product from "../models/Product.js";
import Store from "../models/Store.js";

// GET ALL PRODUCTS FOR LOGGED-IN USER
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id })
      .populate("storeId", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

// CREATE PRODUCT FOR LOGGED-IN USER & UPDATE WAREHOUSE LOAD
export const createProduct = async (req, res) => {
  try {
    const { name, price, stockCount, storeId } = req.body;
    const stock = Number(stockCount) || 0;

    // Verify warehouse belongs to the logged-in user
    if (storeId) {
      const store = await Store.findOne({ _id: storeId, user: req.user._id });
      if (!store) {
        return res
          .status(404)
          .json({ message: "Selected warehouse not found" });
      }
      if (store.currentLoad + stock > store.capacity) {
        return res.status(400).json({
          message: `Exceeds warehouse capacity! Available space: ${store.capacity - store.currentLoad} units`,
        });
      }

      // Increase warehouse load
      store.currentLoad += stock;
      await store.save();
    }

    const newProduct = await Product.create({
      user: req.user._id,
      name,
      price: Number(price),
      stockCount: stock,
      storeId: storeId || null,
    });

    const populatedProduct = await Product.findById(newProduct._id).populate(
      "storeId",
      "name location",
    );

    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

// DELETE PRODUCT & FREE UP WAREHOUSE LOAD
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Deduct product stock from warehouse currentLoad
    if (product.storeId && product.stockCount > 0) {
      await Store.findOneAndUpdate(
        { _id: product.storeId, user: req.user._id },
        { $inc: { currentLoad: -product.stockCount } },
      );
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
