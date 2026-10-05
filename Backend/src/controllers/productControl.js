import Product from "../models/Product.js";
import Store from "../models/Store.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, stockCount, storeId } = req.body;

    if (!name || !price || !storeId) {
      return res
        .status(400)
        .json({ message: "Please Provide a name, price and storeID" });
    }

    const store = await Store.findById(storeId);

    if (!store) {
      res.status(404).json({ message: "Warehouse not Found!!" });
    }

    const stockToAdd = stockCount || 0;
    if (store.currentLoad + stockToAdd > store.capacity) {
      return res.status(400).json({ message: "Warehouse capacity exceeded!" });
    }

    const newProduct = await Product.create({
      name,
      price,
      stockCount: stockToAdd,
      storeId,
    });

    await Store.findByIdAndUpdate(storeId, {
      $inc: { currentLoad: stockToAdd },
    });

    res
      .status(201)
      .json({ message: "Product Created Successfully....", data: newProduct });
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: e.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({}).populate(
      "storeId",
      "name location",
    );
    res.status(200).json(products);
  } catch (e) {
    res
      .status(500)
      .json({ message: "Failed tp fetch Products!", error: e.message });
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteId = await Product.findByIdAndDelete(id);

    if (!deleteId) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    if (deleteId.storeId) {
      await Store.findByIdAndUpdate(deletedProduct.storeId, {
        $inc: { currentLoad: -deletedProduct.stockCount },
      });
    }

    res.status(200).json({ message: "Product deleted Succefully" });
  } catch (err) {
    next(err);
  }
};
