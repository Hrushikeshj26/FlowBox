import express from "express";
import Product from "../models/Product.js";
import Store from "../models/Store.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all inventory routes so req.user._id is available
router.use(protect);

router.post("/transfer", async (req, res) => {
  const { productId, sourceStoreId, targetStoreId, quantity } = req.body;
  const transferQty = Number(quantity);

  try {
    // 1. Basic validation
    if (!productId || !sourceStoreId || !targetStoreId || transferQty <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid transfer parameters provided." });
    }

    // 2. Fetch the product and both warehouses (strictly for the logged-in user)
    const [sourceProduct, sourceStore, targetStore] = await Promise.all([
      Product.findOne({ _id: productId, user: req.user._id }),
      Store.findOne({ _id: sourceStoreId, user: req.user._id }),
      Store.findOne({ _id: targetStoreId, user: req.user._id }),
    ]);

    if (!sourceProduct || !sourceStore || !targetStore) {
      return res
        .status(404)
        .json({ message: "Product or Warehouse not found." });
    }

    if (sourceProduct.stockCount < transferQty) {
      return res
        .status(400)
        .json({ message: "Insufficient stock for transfer." });
    }

    // 3. Prevent exceeding target warehouse capacity
    if (targetStore.currentLoad + transferQty > targetStore.capacity) {
      return res.status(400).json({
        message: `Transfer blocked: Destination facility is over capacity. Max limit is ${targetStore.capacity}.`,
      });
    }

    // Check if the destination warehouse already carries this exact product for this user
    const existingTargetProduct = await Product.findOne({
      user: req.user._id,
      name: sourceProduct.name,
      storeId: targetStoreId,
    });

    // 4. Handle the Product Data Movement
    if (sourceProduct.stockCount === transferQty) {
      // SCENARIO A: Full Transfer
      if (existingTargetProduct) {
        // Merge into the destination product and remove the empty source record
        existingTargetProduct.stockCount += transferQty;
        await existingTargetProduct.save();
        await sourceProduct.deleteOne();
      } else {
        // Move the existing database record directly to the new store
        sourceProduct.storeId = targetStoreId;
        await sourceProduct.save();
      }
    } else {
      // SCENARIO B: Partial Transfer
      // Subtract stock from the source
      sourceProduct.stockCount -= transferQty;
      await sourceProduct.save();

      if (existingTargetProduct) {
        // If they already stock it, merge the quantities
        existingTargetProduct.stockCount += transferQty;
        await existingTargetProduct.save();
      } else {
        // If it's a new item for that warehouse, create a fresh record tied to the user
        const newProduct = new Product({
          user: req.user._id,
          name: sourceProduct.name,
          price: sourceProduct.price,
          stockCount: transferQty,
          storeId: targetStoreId,
        });
        await newProduct.save();
      }
    }

    // 5. Balance the Warehouse Loads
    sourceStore.currentLoad = Math.max(
      0,
      sourceStore.currentLoad - transferQty,
    );
    targetStore.currentLoad += transferQty;

    await sourceStore.save();
    await targetStore.save();

    res.status(200).json({ message: "Transfer completed successfully!" });
  } catch (error) {
    console.error("Transfer Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error during stock transfer." });
  }
});

export default router;
