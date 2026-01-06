import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";
import Stripe from "stripe";
import short, { generate } from "short-uuid";
import { razorpay } from "../config/razorpay.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import ProductModel from "../models/productModel.js";

//global variables

const currency = "inr";
const deliveryCharges = 40;

//getway initalize

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing orders using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    await UserModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//placing orders using stripe method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new OrderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//verify stripe

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await OrderModel.findByIdAndUpdate(orderId, { payment: true });
      await UserModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await OrderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//placing orders using Razorpay method
// const placeOrderRazorpay = async (req, res) => {
//   try {
//     const { amount } = req.body;
//     const receipt = short.generate();
//     const options = {
//       amount: amount * 100,
//       currency: "INR",
//       receipt: receipt,
//     };
//     const razorpayOrder = await razorpay.orders.create(options);
//     if (!razorpayOrder) {
//       return res.status(400);
//     }

//     res.json({
//       success: true,
//       order: {
//         id: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//       },
//       key: process.env.RAZORPAY_KEY,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error });
//   }
// };

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const order = await OrderModel.create({
      userId,
      items,
      razorpayOrderId: razorpayOrder.id,
      amount,
      address,
      status: "waiting_payment",
      paymentExpiresAt: expiresAt,
      date: Date.now(),
      paymentMethod: "razorpay",
    });

    await UserModel.findByIdAndUpdate(order.userId, { cartData: {} });
    res.json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      key: process.env.RAZORPAY_KEY,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const webhook = async (req, res) => {
//   try {
//     const webhookBody = req.body;
//     console.log("webhookBody: " + webhookBody);
//     const webhookSignature = req.get("X-Razorpay-Signature");
//     console.log("webhookSignature" + webhookSignature);
//     const webhookEventId = req.get("X-Razorpay-Event-Id");
//     console.log("webhookEventId" + webhookEventId);
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     if (
//       !validateWebhookSignature(
//         JSON.stringify(webhookBody),
//         webhookSignature,
//         webhookSecret
//       )
//     ) {
//       console.error("validation Error!");
//       return res.status(400);
//     }

//     const payment = await ProductModel.find({ webhookEventId });
//     if (payment.webhookEventId === webhookEventId) {
//       console.error("Duplicate webhook!");
//       return res.status(400);
//     }
//     const event = webhookBody.event;
//     const paymentId = webhookBody.payload.payment.entity.id;
//     const orderId = webhookBody.payload.payment.entity.order_id;
//     const id = webhookBody.payload.payment.entity.notes.id;
//     const receipt = webhookBody.payload.payment.entity.notes.receipt;
//     if (!event || !paymentId || !orderId || !id || !receipt) {
//       console.error("Some fields are missing!");
//       return res.status(400);
//     }
//     if (event === "payment.captured") {
//       console.log("Successfull");
//       await ProductModel.findByIdAndUpdate(id, {
//         payment: true,
//       });
//     }
//     if (event === "payment.failed") {
//       console.log("Failed");
//       await ProductModel.findByIdAndUpdate(id, {
//         payment: false,
//       });
//     }
//     await ProductModel.create({
//       webhookEventId,
//       event,
//       paymentId,
//       orderId,
//       receipt,
//     });
//     return res.status(200);
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

//All orders data for admin panel

import crypto from "crypto";

const webhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event !== "payment.captured") {
      return res.status(200).json({ ignored: true });
    }

    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const paymentId = payment.id;

    const order = await OrderModel.findOne({ razorpayOrderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ⏱️ expiry safety
    if (
      order.status === "waiting_payment" &&
      payment.created_at * 1000 <= order.paymentExpiresAt
    ) {
      order.status = "confirmed";
      order.paymentId = paymentId;
      order.payment = true;
      order.paymentExpiresAt = null;
      order.date = Date.now();
      await order.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const allOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//user order data for frontend

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await OrderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update order status from admin panel

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await OrderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {}
};

const retryRazorpayPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findOne({ razorpayOrderId: orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "confirmed") {
      return res.status(400).json({ message: "Order already paid" });
    }

    if (order.paymentExpiresAt < new Date()) {
      return res.status(400).json({
        message: "Payment session expired. Create new order.",
      });
    }

    // ✅ SAME razorpay order reuse
    res.json({
      success: true,
      order: {
        id: order.razorpayOrderId,
        amount: order.amount * 100,
        currency: "INR",
      },
      key: process.env.RAZORPAY_KEY,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateOrderStatus,
  verifyStripe,
  webhook,
  retryRazorpayPayment,
};
