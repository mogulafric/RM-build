const Appointment = require("../models/AppointmentModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//Add appointment
exports.createAppointment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, message, phone, email, service } = req.body;

    let appointment = await Appointment.findOne({ name });

    appointment = await Appointment.create({
      name,
      message,
      phone,
      email,
      service,
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//  Get appointment Details
exports.appointmentDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update appointment
exports.updateAppointment = catchAsyncErrors(async (req, res, next) => {
  try {
    const appointmentData = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      phone: req.body.phone,
      service: req.body.service,
    };

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      appointmentData
    );

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Single Appointment Details ---Admin
exports.getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  try {
    const appointments = await Appointment.find({});

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get Single Appointment Details ---Admin
exports.getAppointment = catchAsyncErrors(async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new ErrorHandler("Appointment is not found with this id", 400)
      );
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete Appointment ---Admin
exports.deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return next(
        new ErrorHandler("Appointment is not found with this id", 400)
      );
    }

    await appointment.remove();

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
