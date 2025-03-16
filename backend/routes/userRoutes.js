import express from "express";
import {
  signUp,
  login,
  logout,
  adminLogin,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/adminlogin", adminLogin);

export default router;
