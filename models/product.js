const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    inStock: {
        type: Number,
        required: true,
        min: 0,
        max: 250
    },
    tags: {
      type: [String],
    },
    discountPrice: {
      type: Schema.Types.Mixed, 
    },
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
