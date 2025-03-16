import express from "express";

import {
  addToCart,
  updateCart,
  getUserCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/authenticate.js";

const router = express.Router();

router.post("/add", authUser, addToCart);
router.post("/get", authUser, getUserCart);
router.post("/update", authUser, updateCart);

export default router;
