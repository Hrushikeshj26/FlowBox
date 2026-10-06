import express from "express";
import {
  createOrder,
  getOrders,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderControl.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.delete("/:id", deleteOrder);
router.put("/:id/status", updateOrderStatus);

export default router;
