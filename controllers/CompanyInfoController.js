const CompanyInfo = require("../models/CompanyInfo");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const cloudinary = require("../utils/cloudinary");

// Register company
exports.createCompany = catchAsyncErrors(async (req, res, next) => {
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
        folder: "RMAutomotive/companylogo",
        width: 1900,
        crop: "scale",
      });

      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesBuffer;

    const company = await CompanyInfo.create(req.body);

    res.status(201).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
});

//  Get user Details
exports.companyDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const company = await CompanyInfo.findById(req.params.id);

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update Company Profile
exports.updateCompany = catchAsyncErrors(async (req, res, next) => {
  try {
    const newCompanyData = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.body.logo !== "") {
      const company = await CompanyInfo.findById(req.params.id);

      const imageId = user.avatar.public_id;

      await cloudinary.uploader.destroy(imageId);

      const myCloud = await cloudinary.uploader.upload(req.body.logo, {
        folder: "RMAutomotive/images",
        width: 150,
        crop: "scale",
      });
      newCompanyData.logo = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const company = await User.findByIdAndUpdate(
      req.params.id,
      newCompanyData,
      {
        new: true,
        runValidator: true,
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

// Get Single User Details ---Admin
exports.getCompany = catchAsyncErrors(async (req, res, next) => {
  try {
    const company = await CompanyInfo.find();

    // if (!company) {
    //   return next(new ErrorHandler("Company is not found with this id", 400));
    // }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Company ---Admin
exports.deleteCompany = catchAsyncErrors(async (req, res, next) => {
  try {
    const company = await User.findById(req.params.id);

    if (!company) {
      return next(new ErrorHandler("Company is not found with this id", 400));
    }

    await company.remove();

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
