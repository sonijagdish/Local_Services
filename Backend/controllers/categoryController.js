import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  let query = { isApproved: true };

  // If user is admin (and we have user info from optional middleware or similar)
  // Let's check for an admin flag in the query or just restrict it to admin in routes if needed.
  // For now, let's just allow all for admin if they're logged in.
  if (req.user && req.user.role === 'admin') {
    query = {};
  }

  const categories = await Category.find(query);
  res.json(categories);
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Provider
const createCategory = asyncHandler(async (req, res) => {
  const { name, icon, description } = req.body;
  
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({ 
    name, 
    icon, 
    description,
    createdBy: req.user._id,
    isApproved: req.user.role === 'admin' ? true : false
  });
  
  res.status(201).json(category);
});

// @desc    Approve a category
// @route   PUT /api/categories/:id/approve
// @access  Private/Admin
const approveCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.isApproved = true;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
    const { name, icon, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
        category.name = name || category.name;
        category.icon = icon || category.icon;
        category.description = description || category.description;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: "Category removed" });
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

// @desc    Get categories created by current user
// @route   GET /api/categories/my-categories
// @access  Private/Provider
const getMyCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ createdBy: req.user._id });
    res.json(categories);
});

export { getCategories, createCategory, updateCategory, deleteCategory, approveCategory, getMyCategories };
