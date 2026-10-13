import express from "express";
import {
  createSuppliers,
  getSuppliers,
  deleteSuppliers,
  bulkCreateSuppliers,
} from "../controllers/suppliersControl.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/bulk", bulkCreateSuppliers);
router.route("/").get(getSuppliers).post(createSuppliers);
router.route("/:id").delete(deleteSuppliers);

export default router;
