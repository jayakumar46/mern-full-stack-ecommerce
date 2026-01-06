import cron from "node-cron";
import OrderModel from "../models/orderModel.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    const now = new Date();

    const expiredOrders = await OrderModel.find({
      status: "waiting_payment",
      payment: false,
      paymentExpiresAt: { $lt: now },
    });

    for (const order of expiredOrders) {
      order.status = "failed";
      await order.save();
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});
