import express from "express";
import { getCategories, createCategory, updateCategory, deleteCategory, approveCategory, getMyCategories } from "../controllers/categoryController.js";
import { protect, admin, provider } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/admin", protect, admin, getCategories); // Admin can see all (including unapproved)
router.get("/my-categories", protect, provider, getMyCategories);
router.post("/", protect, provider, createCategory);
router.put("/:id/approve", protect, admin, approveCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;
