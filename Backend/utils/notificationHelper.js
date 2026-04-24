import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * Create a notification for a specific user
 * @param {string} userId - ID of the user to notify
 * @param {string} title - Title of the notification
 * @param {string} message - Message body
 * @param {string} type - Type of notification (info, success, warning, error)
 */
export const createNotification = async (userId, title, message, type = "info") => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
    });
    console.log(`Notification created for user ${userId}: ${title}`);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

/**
 * Notify all admin users
 * @param {string} title - Title of the notification
 * @param {string} message - Message body
 * @param {string} type - Type of notification
 */
export const notifyAdmins = async (title, message, type = "info") => {
  try {
    const admins = await User.find({ role: "admin" });
    const notifications = admins.map((admin) => ({
      user: admin._id,
      title,
      message,
      type,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`Admin notification sent to ${admins.length} admins: ${title}`);
    }
  } catch (error) {
    console.error("Error notifying admins:", error);
  }
};
