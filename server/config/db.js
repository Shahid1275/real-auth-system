import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit with failure
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Lost:", err);
  });
};

export default connectDB;