import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModal from "../models/userModal.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
  WELCOME_TEMPLATE,
} from "../config/emailTemplate.js";
// Load environment variables
dotenv.config();

// Set up Nodemailer transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // shahidameen1275@gmail.com
    pass: process.env.GMAIL_PASS, // App Password or Allah.1ha
  },
  debug: true, // Enable debug output
});

// Verify transporter setup
transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP Verification Error:", error);
  } else {
    console.log("SMTP Server is ready to send emails");
  }
});

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Request body:", req.body);

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required", success: false });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format", success: false });
  }

  try {
    const existingUser = await userModal.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModal({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // Send welcome email asynchronously
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Welcome To Shahid's Real-world Auth system",
      // text: `Welcome to Shahid's Auth system. Your account has been successfully created with this email id: ${email}`,
      html: WELCOME_TEMPLATE.replace("{{email}}", email),
    };
    console.log("Mail options:", mailOptions);

    // Remove await to send email in the background
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending welcome email:", error);
      } else {
        console.log("Notification email sent successfully:", info.response);
      }
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
      success: false,
    });
  }

  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully!",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModal.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Send OTP email asynchronously
    const mailOption = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your account verification OTP is ${otp} . Do not share this with anyone and verify your account with this OTP.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    // FIX: Removed await to send email in the background
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error("Error sending OTP email:", error);
      } else {
        console.log("OTP email sent successfully:", info.response);
      }
    });

    return res.json({
      success: true,
      message: "Verification OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in sendVerifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send verification OTP",
      error: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      message: "OTP is required",
    });
  }

  try {
    // Get user ID from authenticated request (via token)
    const userId = req.user._id;

    const user = await userModal.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified",
      });
    }

    if (!user.verifyOtp || user.verifyOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Verify the user
    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;
    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Send OTP email asynchronously
    const mailOption = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      // text: `Your OTP for resetting your password is ${otp} . Do not share this with anyone and use this otp to proceed your reset password.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    // FIX: Removed await to send email in the background
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error("Error sending reset OTP email:", error);
      } else {
        console.log("Reset OTP email sent successfully:", info.response);
      }
    });

    return res.json({
      success: true,
      message: "Reset OTP sent to your email sucessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: " Email , OTP and New Password is required ",
    });
  }
  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const resendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  try {
    const user = await userModal.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await user.save();

    // Send new OTP email
    const mailOption = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP (Resent)",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error("Error resending reset OTP email:", error);
      } else {
        console.log("Reset OTP resent successfully:", info.response);
      }
    });

    return res.json({
      success: true,
      message: "Reset OTP resent to your email successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
