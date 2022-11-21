const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    caption1: {
      type: String,
    },
    caption2: {
      type: String,
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
