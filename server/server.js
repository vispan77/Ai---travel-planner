import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"
dotenv.config();
import dbConnect from "./config/dbConnect.js";
import authRouter from "./routes/authroutes.js";
import aiRouter from "./routes/aiRouter.js";
import cors from "cors";




//db connection
await dbConnect();

const app = express();


//middleware
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL, "http://localhost:5173"
    ],
    credentials: true,
    methods: [
        "GET", "POST", "PUT", "DELETE"
    ]
}))


//routes
app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter)

//home page
app.get("/", (req, res) => {
    res.send("Welcome to the home page")
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
