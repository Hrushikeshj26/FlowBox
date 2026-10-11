import express from "express";
import {
  getWarehouses,
  createWarehouse,
  deleteWarehouse,
} from "../controllers/storeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all warehouse routes
router.use(protect);

router.route("/").get(getWarehouses).post(createWarehouse);
router.route("/:id").delete(deleteWarehouse);

export default router;
