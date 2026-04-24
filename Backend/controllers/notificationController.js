import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

// @desc    Add a notification
// @route   POST /api/notifications
// @access  Private (Internal mostly or for specific triggers)
const addNotification = asyncHandler(async (req, res) => {
  const { user, title, message, type } = req.body;
  const notification = await Notification.create({
    user,
    title,
    message,
    type
  });
  res.status(201).json(notification);
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read
// @access  Private
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { read: true });
  res.json({ message: "All notifications marked as read" });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (notification) {
    if (notification.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Not authorized");
    }
    await notification.deleteOne();
    res.json({ message: "Notification removed" });
  } else {
    res.status(404);
    throw new Error("Notification not found");
  }
});

export { getNotifications, addNotification, markAllRead, deleteNotification };
