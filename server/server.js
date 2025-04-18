import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js"

const allowedOrigins = ['http://localhost:5173']
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
const port = process.env.PORT || 3000;

connectDB();


//Api endpoints
app.get("/", (req, res) => {
    res.send("server is running");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});