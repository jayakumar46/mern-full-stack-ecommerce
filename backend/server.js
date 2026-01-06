import express from "express";
import './jobs/retry-payment.js'
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import authRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

//app config
const app = express();
const port = process.env.PORT || 8000;
connectDB();
connectCloudinary();

app.use("/api/order/webhook", express.raw({ type: "application/json" }));

//middlewares

app.use(express.json());
app.use(cors());

//api endpoints

app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

//server listen

app.listen(port, () => {
  console.log("Server listening on port:" + port);
});
