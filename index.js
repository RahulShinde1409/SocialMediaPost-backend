import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";

const app = express();


app.use(cors({
  origin: "https://social-media-post-frontend.vercel.app", // no trailing slash
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(express.json());
app.use("/static", express.static("uploads"));


mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/v1", userRoute);
app.use("/api/v1", postRoute);

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
}

export default app;