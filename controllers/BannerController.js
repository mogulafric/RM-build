const Banner = require("../models/BannerModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("../utils/cloudinary");

exports.createBanner = catchAsyncErrors(async (req, res, next) => {
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
        folder: "RMAutomotive/banners",
        width: 1900,
        crop: "scale",
      });

      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesBuffer;

    const banner = await Banner.create(req.body);

    res.status(201).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

exports.displayBanner = catchAsyncErrors(async (req, res, next) => {
  try {
    const banners = await Banner.find();

    res.status(201).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get All banners (Admin)
exports.getAdminBanners = catchAsyncErrors(async (req, res, next) => {
  try {
    const banners = await Banner.find({});

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//single banner

exports.getSingleBanner = catchAsyncErrors(async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    const bannerCount = await Banner.countDocuments();

    if (!banner) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      banner,
      bannerCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//update banners
exports.updateBanner = catchAsyncErrors(async (req, res, next) => {
  try {
    let banner = await Banner.findById(req.params.id);
    if (!banner) {
      return next(new ErrorHandler("Banner not found", 404));
    }

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (images !== undefined) {
      // Delete image from cloudinary
      for (let i = 0; i < banner.images.length; i++) {
        await cloudinary.uploader.destroy(banner.images[i].public_id);
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
          folder: "RMAutomotive/banners",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
      req.body.images = imagesLinks;
    }

    banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useUnified: false,
    });
    res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//delete banner
exports.deleteBanner = catchAsyncErrors(async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return next(new ErrorHandler("Banner not found", 404));
    }

    // Deleting images from cloudinary
    for (let i = 0; 1 < banner.images.length; i++) {
      const result = await cloudinary.uploader.destroy(
        banner.images[i].public_id
      );
    }

    await banner.remove();

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
