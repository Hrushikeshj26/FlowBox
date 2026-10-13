import express from "express";
import {
  createProduct,
  getProducts,
  deleteProduct,
  bulkCreateProducts,
} from "../controllers/productControl.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes in this file so req.user is available
router.use(protect);
router.post("/bulk", bulkCreateProducts);
router.post("/", createProduct);
router.get("/", getProducts);
router.delete("/:id", deleteProduct);

export default router;
