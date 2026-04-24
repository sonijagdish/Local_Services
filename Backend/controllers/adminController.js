import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";
import Category from "../models/Category.js";
import Payout from "../models/Payout.js";
import Transaction from "../models/Transaction.js";
import { createNotification } from "../utils/notificationHelper.js";

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({})
    .populate("booking", "status")
    .populate("user", "name email")
    .populate("provider", "name email")
    .sort({ createdAt: -1 });
  res.json(transactions);
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === "admin") {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "name email")
    .populate("service", "name category price")
    .populate("provider", "name email");
  res.json(bookings);
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const userCount = await User.countDocuments({});
  const serviceCount = await Service.countDocuments({});
  const bookingCount = await Booking.countDocuments({});

  const totalRevenue = await Booking.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);

  res.json({
    users: userCount,
    services: serviceCount,
    bookings: bookingCount,
    revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
  });
});

// @desc    Get public stats for Home page
// @route   GET /api/admin/public-stats
// @access  Public
const getPublicStats = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments({});
    const providerCount = await User.countDocuments({ role: 'provider' });
    const serviceCount = await Service.countDocuments({});
    const completedBookingCount = await Booking.countDocuments({ status: 'completed' });
    
    res.json({
        users: userCount,
        providers: providerCount,
        services: serviceCount,
        bookings: completedBookingCount,
        rating: 4.8 // Base platform rating
    });
});

// @desc    Reset System Data (Categories, Services, Bookings)
// @route   POST /api/admin/reset
// @access  Private/Admin
const resetSystem = asyncHandler(async (req, res) => {
  await Booking.deleteMany({});
  await Service.deleteMany({});
  // Optional: keep categories? Usually better to reset categories too if they want full dynamic control
  await Category.deleteMany({}); // Uncommented to include categories in reset
  
  res.json({ message: "System core records purged. Grid is now empty." });
});

// @desc    Get all payouts
// @route   GET /api/admin/payouts
// @access  Private/Admin
const getAllPayouts = asyncHandler(async (req, res) => {
  const payouts = await Payout.find({}).populate("user", "name email wallet").sort({ createdAt: -1 });
  res.json(payouts);
});

// @desc    Update payout status
// @route   PUT /api/admin/payouts/:id
// @access  Private/Admin
const updatePayoutStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const payout = await Payout.findById(req.params.id);

  if (payout) {
    const oldStatus = payout.status;
    payout.status = status;
    const updatedPayout = await payout.save();

    const user = await User.findById(payout.user);

    // If status changed from pending TO completed, deduct money from provider's wallet
    if (status === 'completed' && oldStatus !== 'completed') {
        if (user) {
            user.wallet -= payout.amount;
            await user.save();
        }
    }

    if (user && oldStatus !== status) {
        let msg = `Your payout request of ₹${payout.amount} has been ${status}.`;
        let notifType = status === 'completed' ? 'success' : (status === 'rejected' ? 'error' : 'info');
        
        if (status === 'completed') {
            msg = `Your payout of ₹${payout.amount} via ${payout.method} has been approved and processed.`;
        } else if (status === 'rejected') {
            msg = `Your payout request of ₹${payout.amount} was rejected. The amount has been safely refunded to your wallet.`;
        }

        await createNotification(
            user._id,
            "Payout Update",
            msg,
            notifType
        );
    }

    res.json(updatedPayout);
  } else {
    res.status(404);
    throw new Error("Payout not found");
  }
});

export { 
  getUsers, 
  deleteUser, 
  getAllBookings, 
  getStats, 
  getPublicStats, 
  resetSystem,
  getAllPayouts,
  updatePayoutStatus,
  getTransactions
};