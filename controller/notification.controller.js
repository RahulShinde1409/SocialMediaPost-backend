import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find()
    .populate("userId")
    .populate("postId")
    .sort({ createdAt: -1 });

  res.json(notifications);
};