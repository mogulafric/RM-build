const mongoose = require("mongoose");
const validator = require("validator");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Appointment name is required"],
      trim: true,
      // maxLength: [15, "Service name should not exceeding 15 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      // maxLength: [4000, "Description cannot exceed 4000 characters"],
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
      // maxLength: [13, "Phonenumber cannot exceed 12 digits"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Enter a valid email address"],
    },
    service: {
      type: String,
      ref: "Service",
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
