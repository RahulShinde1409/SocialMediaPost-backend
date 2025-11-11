import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://social-media-post-frontend.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

// ✅ connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ routes
import userRoute from "./routes/user.route.js";
app.use("/api/v1", userRoute);

// ✅ export app (Vercel needs this)
export default app;
