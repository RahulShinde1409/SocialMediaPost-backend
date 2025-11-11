import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";

const app = express();

// ✅ CORS fix — always handle OPTIONS requests
app.use(cors({ origin: "*", credentials: true }));

// ✅ Body parser and static files
app.use(express.json());
app.use("/static", express.static("uploads"));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);

// ✅ Export app for Vercel
export default app;

// ✅ Local dev only
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}
