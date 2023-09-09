const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
		title: {
			type: String,
			required: true
		},
		category: {
			type: [String],
			required: true
		},
		description: {
			type: String,
			required: false
		},
		price: {
			type: Number,
			required: true
		},
		tags: {
			type: [String],
			required: false
		},
		discountPrice: {
			type: Number,
			requred: false
		},
		pictures: {
			type: [String],
			required: true
		},
		highlited: {
			type: Boolean,
			required: false
		}
	},
	{
		timestamps: true
	}
  );

module.exports = mongoose.model("Product", productSchema);