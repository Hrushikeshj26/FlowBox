import express from "express";
import {
  createSuppliers,
  getSuppliers,
  deleteSuppliers,
} from "../controllers/suppliersControl.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // <-- Required so req.user._id is populated

router.route("/").get(getSuppliers).post(createSuppliers);
router.route("/:id").delete(deleteSuppliers);

export default router;
