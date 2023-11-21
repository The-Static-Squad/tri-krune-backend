const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: { type: String, default: "" },
  streetNumber: { type: String, default: "" },
  city: { type: String, default: "" },
  zipCode: { type: String, default: "" },
  country: { type: String, default: "" },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  // profilePicture: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  address: addressSchema,
  company: { type: String, default: "" },
  phone: { type: Number, required: true },
  isAdmin: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now },
});

userSchema.set("toJSON", { virtuals: true });

exports.User = mongoose.model("User", userSchema);
