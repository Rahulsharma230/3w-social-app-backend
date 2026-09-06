const jwt = require("jsonwebtoken");
const User = require("../model/User");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "No token provided, authorization denied",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token is not valid",
            error: error.message,
        });
    }
};

module.exports = authMiddleware;
