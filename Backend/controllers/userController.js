import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";
import Payout from "../models/Payout.js";
import { createNotification, notifyAdmins } from "../utils/notificationHelper.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(`Login attempt for email: ${email}`);

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  if (user) {
    // Notify Admin
    await notifyAdmins(
      "New User Registered",
      `A new ${user.role}, ${user.name} (${user.email}), has joined the platform.`,
      "info"
    );

    // Send Welcome Email
    const isProvider = user.role === 'provider';
    const subject = `Welcome to LocalServe${isProvider ? '!' : '!'}`;
    const message = `Hi ${user.name},\n\nWelcome to LocalServe! We're thrilled to have you on board.\n\n${isProvider ? 'Start setting up your services to get booked!' : 'Explore our diverse range of services today!'}\n\nBest,\nThe LocalServe Team`;
    const html = `<h2>Welcome to LocalServe, ${user.name}!</h2><p>We're thrilled to have you on board.</p><p>${isProvider ? 'Start setting up your services to get booked by clients in your area!' : 'Explore our diverse range of services today and find the best local professionals.'}</p><br/><p>Best regards,<br/><strong>The LocalServe Team</strong></p>`;

    try {
      // Sending email asynchronously so registration isn't blocked if mail fails
      sendEmail({
        email: user.email,
        subject,
        message,
        html
      }).catch(err => console.error("Failed to send welcome email:", err));
    } catch (err) {
      console.error("Welcome email setup error:", err);
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.bio = req.body.bio || user.bio;
    user.skills = req.body.skills || user.skills;
    user.profileImage = req.body.profileImage || user.profileImage;
    user.experience = req.body.experience || user.experience;
    user.certifications = req.body.certifications || user.certifications;
    user.workingHoursStart = req.body.workingHoursStart || user.workingHoursStart;
    user.workingHoursEnd = req.body.workingHoursEnd || user.workingHoursEnd;
    user.payoutMethod = req.body.payoutMethod || user.payoutMethod;
    user.payoutId = req.body.payoutId || user.payoutId;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      skills: updatedUser.skills,
      profileImage: updatedUser.profileImage,
      experience: updatedUser.experience,
      certifications: updatedUser.certifications,
      workingHoursStart: updatedUser.workingHoursStart,
      workingHoursEnd: updatedUser.workingHoursEnd,
      payoutMethod: updatedUser.payoutMethod,
      payoutId: updatedUser.payoutId,
      isVerified: updatedUser.isVerified,
      wallet: updatedUser.wallet,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      bio: user.bio,
      skills: user.skills,
      profileImage: user.profileImage,
      experience: user.experience,
      certifications: user.certifications,
      workingHoursStart: user.workingHoursStart,
      workingHoursEnd: user.workingHoursEnd,
      payoutMethod: user.payoutMethod,
      payoutId: user.payoutId,
      isVerified: user.isVerified,
      wallet: user.wallet,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Update user verification status
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
const updateUserVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : user.isVerified;
        const updatedUser = await user.save();

        // Notify User
        await createNotification(
          user._id,
          "Account Verification Updated",
          `Your account verification status has been updated to: ${user.isVerified ? "Verified" : "Unverified"}.`,
          user.isVerified ? "success" : "warning"
        );

        res.json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.deleteOne();
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

// @desc    Request a payout
// @route   POST /api/users/payout
// @access  Private/Provider
const requestPayout = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  const { method, accountDetails } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Calculate funds already locked in pending requests
  const pendingPayouts = await Payout.find({ user: req.user._id, status: 'pending' });
  const lockedAmount = pendingPayouts.reduce((acc, p) => acc + p.amount, 0);

  if (user.wallet - lockedAmount < amount) {
    res.status(400);
    throw new Error(`Insufficient available balance. You have ₹${lockedAmount} pending approval.`);
  }

  const payout = await Payout.create({
    user: req.user._id,
    amount,
    method,
    accountDetails,
  });

  if (payout) {
    // Notify Admin
    await notifyAdmins(
      "New Payout Request",
      `${user.name} has requested a payout of ₹${amount}.`,
      "warning"
    );

    res.status(201).json(payout);
  } else {
    res.status(400);
    throw new Error("Invalid payout data");
  }
});

// @desc    Get user payouts
// @route   GET /api/users/payouts
// @access  Private
const getPayouts = asyncHandler(async (req, res) => {
  const payouts = await Payout.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(payouts);
});

// @desc    Forgot Password
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set OTP and expiration (10 minutes)
  user.resetPasswordOtp = otp;
  user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;
  
  await user.save();

  const message = `You are receiving this email because a password reset has been requested for your account.\n\nYour 6-digit OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.`;
  const htmlObj = `<h2>Password Reset Request</h2><p>Your 6-digit OTP to reset your password is: <strong style="font-size: 24px;">${otp}</strong>.</p><p>This OTP will expire in 10 minutes.</p><p>If you did not request this, please ignore this email.</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Token - LocalServe App",
      message: message,
      html: htmlObj,
    });

    res.status(200).json({
      message: "OTP sent to your email successfully.",
      success: true
    });
  } catch (error) {
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error("Email could not be sent. Please check EMAIL credentials in .env");
  }
});

// @desc    Reset Password
// @route   POST /api/users/resetpassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  const user = await User.findOne({
    email,
    resetPasswordOtp: otp,
    resetPasswordOtpExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  // Update password and clear OTP
  user.password = newPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful. Please login.", success: true });
});

export { 
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
  resetPassword
};
