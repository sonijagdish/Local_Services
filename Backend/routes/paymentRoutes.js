import express from "express";
import { createRazorpayOrder, verifyRazorpayPayment, getPaymentHistory, getRevenueDashboard } from "../controllers/paymentController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User-facing payment endpoints
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify-payment", protect, verifyRazorpayPayment);

// Payment & transaction history (user, provider, admin)
router.get("/history", protect, getPaymentHistory);

// Admin revenue dashboard
router.get("/revenue", protect, admin, getRevenueDashboard);

export default router;
