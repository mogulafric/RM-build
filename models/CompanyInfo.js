const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CompanyInfoSchema = new Schema(
  {
    companyName: { type: String, required: true },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    mobile: { type: String },
    phone: { type: String },
    email: { type: String },
    vatNumber: { type: String },
    pinNumber: { type: String },
    postCode: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    website: { type: String },
    openingHours: { type: String },
    location: { type: String },
    aboutUs: { type: String },
    companyMotto: { type: String },
  },
  { timestamps: true }
);

const CompanyInfo = mongoose.model("CompanyInfo", CompanyInfoSchema);

module.exports = CompanyInfo;
