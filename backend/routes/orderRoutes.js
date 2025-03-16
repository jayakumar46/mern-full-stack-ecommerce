import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateOrderStatus,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/auth.js";
import authUser from "../middleware/authenticate.js";

const router = express.Router();
//admin features
router.post("/list", adminAuth, allOrders);
router.post("/status", adminAuth, updateOrderStatus);

//payment features
router.post("/place", authUser, placeOrder);
router.post("/stripe", authUser, placeOrderStripe);
router.post("/razorpay", authUser, placeOrderRazorpay);

//user feature
router.post("/userorders", authUser, userOrders);

//verify payment
router.post("/verifystripe", authUser, verifyStripe);
export default router;
