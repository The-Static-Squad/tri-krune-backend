const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: [String],
    },
    discountPrice: {
      type: Number,
    },
    // images: [
    //   {
    //     filename: {
    //       type: String,
    //       default: "",
    //     },
    //     isMain: {
    //       type: Boolean,
    //       default: false,
    //     },
    //     _id: false,
    //   },
    // ],
    images: [{ type: String }],
    highlighted: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
