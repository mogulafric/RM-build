const Service = require("../models/ServiceModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Features = require("../utils/Features");
const cloudinary = require("../utils/cloudinary");

//create a new Service
exports.createService = catchAsyncErrors(async (req, res, next) => {
  try {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    const imagesBuffer = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "RMAutomotive/services",
        width: 1900,
        crop: "scale",
      });

      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesBuffer;

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

// Get All Service (Admin)
exports.getAdminServices = catchAsyncErrors(async (req, res, next) => {
  try {
    const services = await Service.find();

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// get All Services
exports.getAllServices = catchAsyncErrors(async (req, res) => {
  try {
    const resultPerPage = 8;

    const servicesCount = await Service.countDocuments();

    const feature = new Features(Service.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);

    const services = await feature.query;

    res.status(200).json({
      success: true,
      services,
      servicesCount,
      resultPerPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//update services
exports.updateServices = catchAsyncErrors(async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return next(new ErrorHandler("Service not found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      // Delete image from cloudinary
      for (let i = 0; i < service.images.length; i++) {
        await cloudinary.uploader.destroy(service.images[i].public_id);
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
          folder: "RMAutomotive/services",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = imagesLinks;
    }

    service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useUnified: false,
    });
    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//single service

exports.getSingleService = catchAsyncErrors(async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    const serviceCount = await Service.countDocuments();

    if (!service) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      service,
      serviceCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

exports.deleteService = catchAsyncErrors(async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return next(new ErrorHandler("Service not found", 404));
    }
    // Deleting images from cloudinary
    for (let i = 0; 1 < service.images.length; i++) {
      const result = await cloudinary.uploader.destroy(
        service.images[i].public_id
      );
    }

    await service.remove();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create New Review or Update the review
exports.createServiceReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { rating, comment, serviceId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const service = await Service.findById(productId);

    const isReviewed = service.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      service.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      service.reviews.push(review);
      service.numOfReviews = service.reviews.length;
    }

    let avg = 0;

    service.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    service.ratings = avg / service.reviews.length;

    await service.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All reviews of a single service
exports.getSingleServiceReviews = catchAsyncErrors(async (req, res, next) => {
  try {
    const service = await Service.findById(req.query.id);

    if (!service) {
      return next(new ErrorHandler("Service is not found with this id", 404));
    }

    res.status(200).json({
      success: true,
      reviews: service.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete services reviews --Admin
exports.deleteServiceReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const service = await Service.findById(req.query.serviceId);

    if (!service) {
      return next(new ErrorHandler("Service not found with this id", 404));
    }

    const reviews = service.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Service.findByIdAndUpdate(
      req.query.serviceId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
