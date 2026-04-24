import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import { createNotification, notifyAdmins } from "../utils/notificationHelper.js";

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  console.log("Create Booking Request Body:", req.body);
  const { serviceId, bookingDate, bookingTime, address, paymentMode } = req.body;

  const service = await Service.findById(serviceId);
  console.log("Service Found:", service);

  if (service) {
    const booking = new Booking({
      user: req.user._id,
      service: serviceId,
      provider: service.provider,
      bookingDate,
      bookingTime,
      address,
      totalPrice: service.price,
      paymentMode,
    });

    const createdBooking = await booking.save();
    console.log("Booking Created:", createdBooking);

    // Notify Provider
    await createNotification(
      service.provider,
      "New Booking Received",
      `A new booking for "${service.name}" was made by ${req.user.name}. Check your dashboard.`,
      "success"
    );

    // Notify Admin
    await notifyAdmins(
      "New Platform Booking",
      `${req.user.name} booked "${service.name}" by providerId: ${service.provider}.`,
      "info"
    );

    res.status(201).json(createdBooking);
  } else {
    console.log("Service not found for ID:", serviceId);
    res.status(404);
    throw new Error("Service not found");
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("service", "name description price")
    .populate("provider", "name email");

  if (booking) {
    // Check if the user is authorized to see the booking (user or provider)
    if (
      booking.user._id.toString() === req.user._id.toString() ||
      booking.provider._id.toString() === req.user._id.toString() ||
      req.user.role === "admin"
    ) {
      res.json(booking);
    } else {
      res.status(401);
      throw new Error("Not authorized to view this booking");
    }
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id).populate("service", "name");

  if (booking) {
    // Check authorization
    if (
        booking.user.toString() === req.user._id.toString() ||
        booking.provider.toString() === req.user._id.toString() || 
        req.user.role === "admin"
    ) {
      const oldStatus = booking.status;
      booking.status = status;
      const updatedBooking = await booking.save();

      // Notify Customer of status change
      if (oldStatus !== status) {
        await createNotification(
          booking.user,
          "Booking Status Updated",
          `Your booking for "${booking.service.name}" is now ${status}.`,
          "info"
        );
      }

      res.json(updatedBooking);
    } else {
      res.status(401);
      throw new Error("Not authorized to update status");
    }
  } else {
    res.status(404);
    throw new Error("Booking not found");
  }
});

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ 
    user: req.user._id,
    hiddenByCustomer: { $ne: true }
  }).populate("service provider", "name email price");
  res.json(bookings);
});

// @desc    Get provider specific bookings
// @route   GET /api/bookings/provider-bookings
// @access  Private/Provider
const getProviderBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ provider: req.user._id }).populate("user service", "name email phone profileImage price");
  res.json(bookings);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({})
        .populate("user", "name email phone profileImage")
        .populate("service", "name price")
        .populate("provider", "name email");
    res.json(bookings);
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (req.user.role === 'admin') {
            await booking.deleteOne();
            res.json({ message: "Booking record deleted" });
        } else {
            res.status(401);
            throw new Error("Not authorized to delete booking record");
        }
    } else {
        res.status(404);
        throw new Error("Booking not found");
    }
});

// @desc    Mark booking as paid (for cash/offline)
// @route   PUT /api/bookings/:id/pay
// @access  Private
const markAsPaid = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate("service", "name");

    if (!booking) {
        res.status(404);
        throw new Error("Booking not found");
    }

    if (booking.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("Only customer can confirm payment");
    }

    if (booking.isPaid) {
        return res.json({ message: "Already paid", booking });
    }

    const { paymentMode } = req.body;
    const cashPaymentId = `CASH_${Date.now()}`;
    
    // Update booking payment fields
    booking.isPaid = true;
    booking.paidAt = Date.now();
    booking.paymentMode = paymentMode || "cash";
    booking.paymentStatus = "success";
    booking.paymentResult = {
        id: cashPaymentId,
        status: "captured",
        update_time: new Date().toISOString(),
    };
    const updatedBooking = await booking.save();

    // Commission split — same logic as digital payments
    const COMMISSION_RATE = 0.20;
    const totalAmount = booking.totalPrice;
    const platformCharge = Math.round(totalAmount * COMMISSION_RATE * 100) / 100;
    const providerShare = Math.round((totalAmount - platformCharge) * 100) / 100;

    // Create Transaction record for cash payment too
    const Transaction = (await import("../models/Transaction.js")).default;
    await Transaction.create({
        booking: booking._id,
        user: booking.user,
        provider: booking.provider,
        totalAmount,
        platformCharge,
        providerShare,
        paymentId: cashPaymentId,
        orderId: `CASH_ORDER_${booking._id}`,
        status: "captured",
    });

    // Credit provider wallet
    await User.findByIdAndUpdate(booking.provider, {
        $inc: { wallet: providerShare },
    });

    // Notify provider
    await createNotification(
        booking.provider,
        "Cash Payment Received",
        `₹${providerShare} credited for "${booking.service?.name}". Cash collected from customer.`,
        "success"
    );

    res.json(updatedBooking);
});

// @desc    Hide booking from user's dashboard
// @route   PUT /api/bookings/:id/hide
// @access  Private
const hideBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
        if (booking.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error("Not authorized to hide this booking");
        }

        booking.hiddenByCustomer = true;
        await booking.save();
        res.json({ message: "Booking archived from dashboard" });
    } else {
        res.status(404);
        throw new Error("Booking not found");
    }
});

export {
  createBooking,
  getBookingById,
  updateBookingStatus,
  getMyBookings,
  getProviderBookings,
  getBookings,
  deleteBooking,
  markAsPaid,
  hideBooking,
};
