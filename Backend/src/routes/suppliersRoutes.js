import express from "express";
import {
  createSuppliers,
  getSuppliers,
  deleteSuppliers,
} from "../controllers/suppliersControl.js";

const router = express.Router();

router.post("/", createSuppliers);
router.get("/", getSuppliers);
router.delete("/:id", deleteSuppliers);

export default router;
