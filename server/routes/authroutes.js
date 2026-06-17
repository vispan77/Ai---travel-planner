import express from "express";
const authRouter = express.Router();
import { register, login, logout, getMe, googleAuth } from "../controllers/authControllers.js";
import isAuth from "../middleware/authMiddleware.js";

authRouter.post("/register", register);
authRouter.post("/google-auth", googleAuth);
authRouter.post("/login", login);
authRouter.get("/getme", isAuth, getMe);
authRouter.get("/logout", logout)

export default authRouter;