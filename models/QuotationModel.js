const mongoose = require("mongoose");
const validator = require("validator");

const quotationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      // maxLength: [15, "Service name should not exceeding 15 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      // maxLength: [4000, "Description cannot exceed 4000 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Enter a valid email address"],
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Quotation", quotationSchema);
