import express from "express"
import upload from "../services/multer.js";
import { aiResponse, analysePdf, getItineraryById, getAllItenery, deleteItinery } from "../controllers/aiResponseControllers.js";
import isAuth from "../middleware/authMiddleware.js";
const aiRouter = express.Router();

aiRouter.post("/upload", isAuth, upload.single("file"), analysePdf);
aiRouter.post("/ai-response", isAuth, upload.single("file"), aiResponse);
aiRouter.get("/get-all", isAuth, getAllItenery)
aiRouter.get("/get-by-id/:itineryId", getItineraryById)
aiRouter.delete("/delete/:itineryId", isAuth, deleteItinery)

export default aiRouter;