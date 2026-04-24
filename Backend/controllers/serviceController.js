import asyncHandler from "express-async-handler";
import Service from "../models/Service.js";
import { createNotification, notifyAdmins } from "../utils/notificationHelper.js";

// @desc    Fetch all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const category = req.query.category;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  let query = { ...keyword };
  if (category) {
    query.category = category;
  }

  // Only show approved and available services unless admin
  if (!req.user || req.user.role !== "admin") {
    query.isApproved = true;
    query.availability = true;
  }

  console.log("Fetching Services with query:", query);
  const services = await Service.find(query)
    .populate("provider", "name email phone profileImage isVerified")
    .populate("category", "name")
    .sort({ createdAt: -1 });
  res.json(services);
});

// @desc    Fetch single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate("provider", "name email phone profileImage bio experience skills certifications workingHoursStart workingHoursEnd isVerified");

  if (service) {
    // If not approved, only admin or the provider can see it
    if (!service.isApproved) {
        if (!req.user || (req.user.role !== 'admin' && service.provider._id.toString() !== req.user._id.toString())) {
            res.status(403);
            throw new Error("Service is awaiting approval and is not public yet.");
        }
    }
    res.json(service);
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Provider
const createService = asyncHandler(async (req, res) => {
  const { name, description, category, price, image } = req.body;

  const service = new Service({
    name,
    description,
    category,
    price,
    image,
    provider: req.user._id,
    isApproved: req.user.role === 'admin' ? true : false
  });

  const createdService = await service.save();

  // Notify Admin
  if (req.user.role === 'provider') {
    await notifyAdmins(
      "New Service Created",
      `A new service "${name}" was created by ${req.user.name} and is awaiting approval.`,
      "info"
    );
  }

  res.status(201).json(createdService);
});

// @desc    Approve a service
// @route   PUT /api/services/:id/approve
// @access  Private/Admin
const approveService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    service.isApproved = true;
    const updatedService = await service.save();

    // Notify Provider
    await createNotification(
        service.provider,
        "Service Approved",
        `Your service "${service.name}" has been approved and is now live!`,
        "success"
    );

    res.json(updatedService);
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

// @desc    Create new review
// @route   POST /api/services/:id/reviews
// @access  Private
const createServiceReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const service = await Service.findById(req.params.id);

  if (service) {
    const alreadyReviewed = service.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Service already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    service.reviews.push(review);

    service.numReviews = service.reviews.length;

    service.rating =
      service.reviews.reduce((acc, item) => item.rating + acc, 0) /
      service.reviews.length;

    await service.save();

    // Notify Provider of new review
    await createNotification(
        service.provider,
        "New Service Review",
        `Your service "${service.name}" received a new ${rating}-star review from ${req.user.name}.`,
        "info"
    );

    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Service not found");
  }
});

const getMyServices = asyncHandler(async (req, res) => {
    const services = await Service.find({ provider: req.user._id });
    res.json(services);
});

const updateService = asyncHandler(async (req, res) => {
    const { name, description, category, price, availability } = req.body;
    const service = await Service.findById(req.params.id);

    if (service) {
        if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error("Not authorized to update this service");
        }

        service.name = name || service.name;
        service.description = description || service.description;
        service.category = category || service.category;
        service.price = price !== undefined ? price : service.price;
        service.availability = availability !== undefined ? availability : service.availability;

        const updatedService = await service.save();
        res.json(updatedService);
    } else {
        res.status(404);
        throw new Error("Service not found");
    }
});

const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (service) {
        if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            res.status(401);
            throw new Error("Not authorized to delete this service");
        }

        await service.deleteOne();
        res.json({ message: "Service removed" });
    } else {
        res.status(404);
        throw new Error("Service not found");
    }
});

// @desc    Get all reviews (Admin)
// @route   GET /api/services/reviews
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
    const services = await Service.find({}).populate("reviews.user", "name email");
    let allReviews = [];
    services.forEach(service => {
        service.reviews.forEach(review => {
            allReviews.push({
                ...review._doc,
                serviceId: service._id,
                serviceName: service.name
            });
        });
    });
    // Sort by date (newest first)
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(allReviews);
});

// @desc    Delete review (Admin)
// @route   DELETE /api/services/:serviceId/reviews/:reviewId
// @access  Private/Admin
const deleteReviewAdmin = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.serviceId);

    if (service) {
        service.reviews = service.reviews.filter(
            (rev) => rev._id.toString() !== req.params.reviewId.toString()
        );

        service.numReviews = service.reviews.length;

        service.rating =
            service.reviews.length > 0
                ? service.reviews.reduce((acc, item) => item.rating + acc, 0) /
                service.reviews.length
                : 0;

        await service.save();
        res.json({ message: "Review removed" });
    } else {
        res.status(404);
        throw new Error("Service not found");
    }
});

// @desc    Get reviews for services of a provider
// @route   GET /api/services/provider-reviews
// @access  Private/Provider
const getProviderReviews = asyncHandler(async (req, res) => {
    const services = await Service.find({ provider: req.user._id }).populate("reviews.user", "name email profileImage");
    let providerReviews = [];
    services.forEach(service => {
        service.reviews.forEach(review => {
            providerReviews.push({
                ...review._doc,
                serviceId: service._id,
                serviceName: service.name
            });
        });
    });
    // Sort by date (newest first)
    providerReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(providerReviews);
});

export {
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
};
