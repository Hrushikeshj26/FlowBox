import express from "express";
import {
  getOrders,
  createOrder,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderControl.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getOrders).post(createOrder);
router
  .route("/:id")
  .delete(deleteOrder)
  .put(updateOrderStatus)
  .patch(updateOrderStatus);

export default router;
