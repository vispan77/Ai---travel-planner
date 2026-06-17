import jwt from "jsonwebtoken"
import User from "../model/user.js";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies || req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            })
        }
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User is not authenticated"
        })
    }
}

export default isAuth;