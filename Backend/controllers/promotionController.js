import asyncHandler from "express-async-handler";
import Promotion from "../models/Promotion.js";

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Private/Admin
const getPromotions = asyncHandler(async (req, res) => {
  const promotions = await Promotion.find({});
  res.json(promotions);
});

// @desc    Create promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = asyncHandler(async (req, res) => {
  const { code, discount, type, description } = req.body;

  const exists = await Promotion.findOne({ code });

  if (exists) {
    res.status(400);
    throw new Error("Promotion code already exists");
  }

  const promotion = new Promotion({
    code,
    discount,
    type,
    description,
  });

  const created = await promotion.save();
  res.status(201).json(created);
});

// @desc    Delete promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
const deletePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);

  if (promotion) {
    await promotion.deleteOne();
    res.json({ message: "Promotion purged" });
  } else {
    res.status(404);
    throw new Error("Promotion not found");
  }
});

export { getPromotions, createPromotion, deletePromotion };
