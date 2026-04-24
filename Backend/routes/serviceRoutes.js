import express from "express";
import {
  getServices,
  getServiceById,
  createService,
  createServiceReview,
  getMyServices,
  updateService,
  deleteService,
  getAllReviews,
  deleteReviewAdmin,
  approveService,
  getProviderReviews,
} from "../controllers/serviceController.js";
import { protect, provider, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.get("/admin", protect, admin, getServices); // Admin can see all (including unapproved)
router.get("/reviews", protect, admin, getAllReviews);
router.put("/:id/approve", protect, admin, approveService);
router.get("/my-services", protect, provider, getMyServices);
router.get("/provider-reviews", protect, provider, getProviderReviews);
router.post("/", protect, provider, createService);
router.get("/:id", getServiceById);
router.put("/:id", protect, provider, updateService);
router.delete("/:id", protect, provider, deleteService);
router.post("/:id/reviews", protect, createServiceReview);
router.delete("/:id/reviews/:reviewId", protect, admin, deleteReviewAdmin);

export default router;
