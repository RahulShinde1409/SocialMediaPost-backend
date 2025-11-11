import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import postModel from "./models/post.model.js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_DB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

// ✅ Folder containing offline images
const uploadDir = path.resolve("./uploads");

// ✅ Upload all files and update DB
async function uploadAllImages() {
  const files = fs.readdirSync(uploadDir);

  for (const file of files) {
    const filePath = path.join(uploadDir, file);
    console.log("📤 Uploading:", filePath);

    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "social-media-posts",
      });

      console.log("✅ Uploaded:", result.secure_url);

      // Update MongoDB document (find post by old filename)
      const updatedPost = await postModel.findOneAndUpdate(
        { image: { $regex: file } },  // match documents whose image field contains the filename
        { image: result.secure_url }, // replace with Cloudinary URL
        { new: true }
      );

      if (updatedPost) {
        console.log("🟢 MongoDB updated for:", updatedPost.title);
      } else {
        console.log("⚠️ No matching post found for:", file);
      }

    } catch (err) {
      console.error("❌ Upload failed for:", file, err.message);
    }
  }

  console.log("🎉 All uploads + updates complete!");
  process.exit();
}

uploadAllImages();
