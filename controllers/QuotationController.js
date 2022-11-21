const Quotation = require("../models/QuotationModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//Add quotation
exports.createQuotation = catchAsyncErrors(async (req, res, next) => {
  console.log("5555555555555555555555555555555555555");
  try {
    const { name, message, email } = req.body;

    let quotation = await Quotation.findOne({ name });

    quotation = await Quotation.create({
      name,
      message,
      email,
    });

    res.status(201).json({
      success: true,
      quotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//  Get quotation Details
exports.quotationDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    res.status(200).json({
      success: true,
      quotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update appointment
exports.updateQuotation = catchAsyncErrors(async (req, res, next) => {
  try {
    const quotationData = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    };

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      quotationData
    );

    res.status(200).json({
      success: true,
      message: "Quotation updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Single quotation Details ---Admin
exports.getAllQuotations = catchAsyncErrors(async (req, res, next) => {
  try {
    const quotations = await Quotation.find({});

    res.status(200).json({
      success: true,
      quotations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Single quotation Details ---Admin
exports.getQuotation = catchAsyncErrors(async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return next(new ErrorHandler("Quotation is not found with this id", 400));
    }

    res.status(200).json({
      success: true,
      quotation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete quotation ---Admin
exports.deleteQuotation = catchAsyncErrors(async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id);

    if (!quotation) {
      return next(new ErrorHandler("Quotation is not found with this id", 400));
    }

    await quotation.remove();

    res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
