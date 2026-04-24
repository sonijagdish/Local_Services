import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserVerification,
  deleteUser,
  requestPayout,
  getPayouts,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/", protect, admin, getUsers);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/payout", protect, requestPayout);
router.get("/payouts", protect, getPayouts);
router.put("/:id/verify", protect, admin, updateUserVerification);
router.delete("/:id", protect, admin, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
