import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resendResetOtp,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-rest-otp", sendResetOtp);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/resend-reset-otp", resendResetOtp);

export default authRouter;
