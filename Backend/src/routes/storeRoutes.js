import express from "express";
import { createStore, getStore } from "../controllers/storeController.js";

const router = express.Router();

router.post('/', createStore)
router.get('/', getStore)

export default router;
