import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isRead: {
    type: Boolean,
    default: false
  }
},{
    timestamps:true
});

export default mongoose.model("Notification", notificationSchema);