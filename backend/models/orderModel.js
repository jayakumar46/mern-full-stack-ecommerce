import mongoose from "mongoose";
import { type } from "os";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order Placed" },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    paymentExpiresAt: { type: Date },
    webhookEventId: { type: String },
    event: { type: String },
    paymentId: { type: String },
    receipt: { type: String },
    razorpayOrderId: { type: String },
    date: { type: Number },
  },
  { timestamps: true }
);

const OrderModel =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default OrderModel;
