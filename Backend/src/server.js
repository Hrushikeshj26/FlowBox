import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import storeRoutes from "./routes/storeRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.get("/api/health", (req, res) => {
  res.json({ message: "FlowBox API is running smoothly....." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sever Running on PORT: ${PORT}`);
});
