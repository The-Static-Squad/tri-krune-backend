const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: false
		},
		images: {
			type: [String],
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		discountPrice: {
			type: Number,
			required: false
		},
		tags: {
			type: [String],
			required: false
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Product", productSchema);