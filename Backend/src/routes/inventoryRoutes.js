import express from "express";
const router = express.Router();
import Product from "../models/Product.js";
import Store from "../models/Store.js";

router.post("/transfer", async (req, res) => {
  const { productId, sourceStoreId, targetStoreId, quantity } = req.body;

  try {
    // 1. Basic validation
    if (!productId || !sourceStoreId || !targetStoreId || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid transfer parameters provided." });
    }

    // 2. Fetch the product and both warehouses
    const sourceProduct = await Product.findById(productId);
    const sourceStore = await Store.findById(sourceStoreId);
    const targetStore = await Store.findById(targetStoreId);

    if (!sourceProduct || !sourceStore || !targetStore) {
      return res
        .status(404)
        .json({ message: "Product or Warehouse not found." });
    }

    if (sourceProduct.stockCount < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient stock for transfer." });
    }

    // 3. Prevent exceeding target warehouse capacity
    if (targetStore.currentLoad + quantity > targetStore.capacity) {
      return res.status(400).json({
        message: `Transfer blocked: Destination facility is over capacity. Max limit is ${targetStore.capacity}.`,
      });
    }

    // 4. Handle the Product Data Movement
    if (sourceProduct.stockCount === quantity) {
      // SCENARIO A: Full Transfer.
      // Move the existing database record directly to the new store.
      sourceProduct.storeId = targetStoreId;
      await sourceProduct.save();
    } else {
      // SCENARIO B: Partial Transfer.
      // Subtract stock from the source.
      sourceProduct.stockCount -= quantity;
      await sourceProduct.save();

      // Check if the destination warehouse already carries this exact product
      let existingTargetProduct = await Product.findOne({
        name: sourceProduct.name,
        storeId: targetStoreId,
      });

      if (existingTargetProduct) {
        // If they already stock it, just merge the quantities
        existingTargetProduct.stockCount += quantity;
        await existingTargetProduct.save();
      } else {
        // If it's a new item for that warehouse, create a fresh record
        const newProduct = new Product({
          name: sourceProduct.name,
          price: sourceProduct.price,
          stockCount: quantity,
          storeId: targetStoreId,
        });
        await newProduct.save();
      }
    }

    // 5. Balance the Warehouse Loads
    sourceStore.currentLoad -= quantity;
    targetStore.currentLoad += quantity;

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
