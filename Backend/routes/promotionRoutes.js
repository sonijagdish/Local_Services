import express from "express";
import { getPromotions, createPromotion, deletePromotion } from "../controllers/promotionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, admin, getPromotions)
  .post(protect, admin, createPromotion);

router.route("/:id")
  .delete(protect, admin, deletePromotion);

export default router;
