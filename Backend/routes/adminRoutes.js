import express from "express";
import {
  getUsers,
  deleteUser,
  getAllBookings,
  getStats,
  getPublicStats,
  resetSystem,
  getAllPayouts,
  updatePayoutStatus,
  getTransactions
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/public-stats", getPublicStats);

// Protected
router.use(protect);
router.use(admin);

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/bookings", getAllBookings);
router.get("/stats", getStats);
router.get("/payouts", getAllPayouts);
router.put("/payouts/:id", updatePayoutStatus);
router.get("/transactions", getTransactions);
router.post("/reset", resetSystem);

export default router;
