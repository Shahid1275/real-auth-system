import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User not authorized, please log in first"
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decodedToken.id }; // Attach to req.user instead of req.body
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

export default userAuth;