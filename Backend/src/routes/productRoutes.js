import express from "express";
import {
  createProduct,
  getProduct,
  deleteProduct,
} from "../controllers/productControl.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProduct);
router.delete("/:id", deleteProduct);

export default router;
