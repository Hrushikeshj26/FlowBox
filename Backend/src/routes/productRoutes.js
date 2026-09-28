import express from "express";
import { createProduct, getProduct } from "../controllers/productControl.js";

const router = express.Router()

router.post('/', createProduct)
router.get('/', getProduct)

export default router;
