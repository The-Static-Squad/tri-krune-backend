const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
  });
  
exports.Product = mongoose.model("Product", productSchema);