import express from "express";
import {
  createBooking,
  getBookingById,
  updateBookingStatus,
  getMyBookings,
  getProviderBookings,
  getBookings,
  deleteBooking,
  markAsPaid,
  hideBooking,
} from "../controllers/bookingController.js";
import { protect, provider, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/", protect, admin, getBookings);
router.get("/my-bookings", protect, getMyBookings);
router.get("/provider-bookings", protect, provider, getProviderBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/status", protect, updateBookingStatus);
router.put("/:id/pay", protect, markAsPaid);
router.put("/:id/hide", protect, hideBooking);
router.delete("/:id", protect, admin, deleteBooking);

export default router;
