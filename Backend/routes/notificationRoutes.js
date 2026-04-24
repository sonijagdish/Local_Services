import express from "express";
import {
  getNotifications,
  addNotification,
  markAllRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getNotifications)
  .post(protect, addNotification);

router.put("/read", protect, markAllRead);
router.delete("/:id", protect, deleteNotification);

export default router;
