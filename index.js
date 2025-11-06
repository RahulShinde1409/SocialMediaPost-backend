import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";

import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";

const app = express();

// ✅ 1. Handle CORS manually (for Vercel)
app.use((req, res, next) => {
  const allowedOrigin = "https://social-media-post-frontend.vercel.app"; // frontend URL (no slash)
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // ✅ Respond immediately to preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ✅ 2. Parse body and serve static files
app.use(express.json());
app.use("/static", express.static("uploads"));

// ✅ 3. Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// ✅ 4. Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use(process.env.API_PREFIX || "/api/v1", userRoute);
app.use(process.env.API_PREFIX || "/api/v1", postRoute);

// ✅ 5. Export app for Vercel (no app.listen)
export default app;

// ✅ 6. Local dev (for testing)
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}
