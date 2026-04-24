import asyncHandler from "express-async-handler";
import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { createNotification } from "../utils/notificationHelper.js";
import dotenv from "dotenv";

dotenv.config();

// Initialize Razorpay once, safely
let razorpay;
const getRazorpayInstance = () => {
  if (razorpay) return razorpay;
  
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("[Payment] CRITICAL ERROR: Razorpay environment variables are missing.");
  }

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return razorpay;
};

/**
 * Commission Configuration
 * Platform retains this percentage from every transaction.
 */
const PLATFORM_COMMISSION_RATE = 0.20; // 20% platform fee

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payment/create-order
 * @access  Private
 */
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate("service", "name price");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.isPaid) {
    res.status(400);
    throw new Error("This booking has already been paid for");
  }

  const amountInPaise = Math.round(booking.totalPrice * 100);

  const options = {
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${bookingId.toString().slice(-15)}_${Date.now()}`,
    notes: {
      bookingId: bookingId.toString(),
      serviceName: booking.service?.name || "Service",
      userId: booking.user.toString(),
      providerId: booking.provider.toString(),
    },
  };

  try {
    const rzp = getRazorpayInstance();
    const order = await rzp.orders.create(options);

    // Mark payment as pending in booking
    booking.paymentStatus = "pending";
    await booking.save();

    console.log(`[Payment] Order successfully created: ${order.id} for Booking: ${bookingId}`);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
      serviceName: booking.service?.name,
    });
  } catch (error) {
    console.error("[Payment] Razorpay Order Creation FAILED:", error);
    booking.paymentStatus = "failed";
    await booking.save();
    res.status(500);
    const errorMessage = error.error?.description || "Failed to create payment order. Please try again.";
    throw new Error(errorMessage);
  }
});

/**
 * @desc    Verify Razorpay Payment Signature & Process Settlement
 * @route   POST /api/payment/verify-payment
 * @access  Private
 */
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  // Step 1: Cryptographic Signature Verification
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.error(`[Payment] Signature Verification FAILED for Order: ${razorpay_order_id}`);
    console.error(`Expected: ${expectedSignature.substring(0, 5)}... Received: ${razorpay_signature.substring(0, 5)}...`);
    
    // Mark as failed
    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "failed" });
    res.status(400);
    throw new Error("Payment signature verification failed. Security alert triggered.");
  }

  console.log(`[Payment] Signature Verified for Order: ${razorpay_order_id}`);

  // Step 2: Load booking with related data
  const booking = await Booking.findById(bookingId).populate("service", "name price");
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.isPaid) {
    return res.json({ success: true, message: "Payment already processed" });
  }

  // Step 3: Update Booking — Mark as Paid
  booking.isPaid = true;
  booking.paidAt = Date.now();
  booking.paymentMode = "digital";
  booking.paymentStatus = "success";
  booking.paymentResult = {
    id: razorpay_payment_id,
    status: "captured",
    update_time: new Date().toISOString(),
  };
  await booking.save();

  // Step 4: Commission Split Calculation
  const totalAmount = booking.totalPrice;
  const platformCharge = Math.round(totalAmount * PLATFORM_COMMISSION_RATE * 100) / 100;
  const providerShare = Math.round((totalAmount - platformCharge) * 100) / 100;

  // Step 5: Create Transaction Record (Financial Ledger)
  const transaction = await Transaction.create({
    booking: booking._id,
    user: booking.user,
    provider: booking.provider,
    totalAmount,
    platformCharge,
    providerShare,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    status: "captured",
  });

  // Step 6: Credit Provider Wallet
  await User.findByIdAndUpdate(booking.provider, {
    $inc: { wallet: providerShare },
  });

  // Step 7: Notify Provider about payment received
  await createNotification(
    booking.provider,
    "Payment Received",
    `₹${providerShare} credited to your wallet for "${booking.service?.name}". Platform commission: ₹${platformCharge}.`,
    "success"
  );

  console.log(`[Payment] ✅ Verified & Settled: ₹${totalAmount} → Provider: ₹${providerShare} | Platform: ₹${platformCharge}`);

  res.json({
    success: true,
    message: "Payment verified and settled successfully",
    transaction: {
      id: transaction._id,
      totalAmount,
      platformCharge,
      providerShare,
      paymentId: razorpay_payment_id,
    },
  });
});

/**
 * @desc    Get payment history for the logged-in user
 * @route   GET /api/payment/history
 * @access  Private
 */
const getPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  let filter = {};
  if (role === "user") {
    filter.user = userId;
  } else if (role === "provider") {
    filter.provider = userId;
  }
  // Admin sees all

  const transactions = await Transaction.find(filter)
    .populate("booking", "status totalPrice bookingDate paymentMode paymentStatus")
    .populate("user", "name email")
    .populate("provider", "name email")
    .sort({ createdAt: -1 });

  res.json(transactions);
});

/**
 * @desc    Get admin revenue dashboard data
 * @route   GET /api/payment/revenue
 * @access  Private/Admin
 */
const getRevenueDashboard = asyncHandler(async (req, res) => {
  const pipeline = await Transaction.aggregate([
    { $match: { status: "captured" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        totalPlatformEarnings: { $sum: "$platformCharge" },
        totalProviderPayouts: { $sum: "$providerShare" },
        transactionCount: { $sum: 1 },
      },
    },
  ]);

  const stats = pipeline[0] || {
    totalRevenue: 0,
    totalPlatformEarnings: 0,
    totalProviderPayouts: 0,
    transactionCount: 0,
  };

  // Recent transactions for the dashboard table
  const recentTransactions = await Transaction.find({ status: "captured" })
    .populate("user", "name")
    .populate("provider", "name")
    .populate("booking", "status")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({
    ...stats,
    commissionRate: PLATFORM_COMMISSION_RATE,
    recentTransactions,
  });
});

export { createRazorpayOrder, verifyRazorpayPayment, getPaymentHistory, getRevenueDashboard };
