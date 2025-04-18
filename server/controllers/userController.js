import userModal from "../models/userModal.js";

const getUserData = async (req, res) => {
  try {
    // Get user ID from authenticated request (via token)
    const userId = req.user._id;
    
    const user = await userModal.findById(userId).select('-password -verifyOtp -verifyOtpExpireAt');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        _id: user._id,
        email: user.email,
        isAccountVerified: user.isAccountVerified
      },
      message: "User data fetched successfully",
    });
  } catch (error) {
    console.error("Error in getUserData:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

export default getUserData;