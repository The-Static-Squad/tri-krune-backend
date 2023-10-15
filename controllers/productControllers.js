const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');

const getAllProducts = async (req, res) => {
	const products = await Product.find({}).sort({ name: -1 });

	if (products.length === 0) {
		return res.status(404).json({ 'message': 'no products found' })
	}

	res.status(200).json(products);
}

const getProductById = async (req, res) => {
	const id = req.params.id

	//check if id matches mongoose pattern
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ "message": "Invalid Id" });
	}

	const product = await Product.findById(id);

	if (!product) {
		return res.status(404).json({ "message": "Product not found" });
	}

	res.status(200).json(product);
}

const addProduct = async (req, res) => {

	const data = req.body;
	const product = new Product({ ...data });

	//convert tags input from a string to an array
	if (product.tags.length !== 0) {
		const tagArray = product.tags[0].split(' ');
		product.tags = [];
		tagArray.forEach(tag => {
			if (tag.length > 0) {
				product.tags.push(tag);
			}
		});
	}

	//add image paths to appropriate fields
	const images = req.files;
	if (images) {
		const mainImg = images['prodImage'][0];
		const additionalImgs = images['addImages']

		if (mainImg) {
			product.mainImg = mainImg.path;
		}

		if (additionalImgs) {
			additionalImgs.forEach(image => {
				product.pictures.push(image.path);
			});
		}
	}

	try {
		const addedProduct = await product.save();
		res.status(201).json(addedProduct);
	} catch (error) {
		return res.status(400).json({ error: error.message })
	}
}

const deleteProduct = async (req, res) => {
	const id = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ message: 'invalid Id' });
	}

	const deletedProduct = await Product.findOneAndDelete({ _id: id });

	if (!deletedProduct) {
		return res.status(404).json({ "message": "No such product" });
	}

	const allImgs = deletedProduct.pictures.concat(deletedProduct.mainImg);

	const deleteErrors = [];

	allImgs.forEach(image => {
		try {
			fs.unlinkSync(image);
			console.log(image + " deleted")
		} catch (err) {
			deleteErrors.push(err);
		}
	});

	if (deleteErrors.length > 0) {
		return res.status(207).json({ message: "Product deleted, with errors in deleting files", images_not_deleted: deleteErrors, deleted_product : deletedProduct, })
	}

	res.status(200).json(deletedProduct);
}

const updateProduct = async (req, res) => {
	const id = req.params.id;
	const newValues = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res(400).json({ message: 'invalid Id' });
	}

	const newMainImage = req.files['prodImage'];
	const newAdditionalImages = req.files['addImages'];

	if (newMainImage) {
		newValues.mainImg = newMainImage[0].path;
	}

	if (newAdditionalImages) {

		newValues.pictures = newValues.pictures.split(",");
		newAdditionalImages.forEach(image => {

				newValues.pictures.push(image.path);
		});
	}

	const productToUpdate = await Product.findOneAndUpdate({ _id: id }, { ...newValues });

	if (!productToUpdate) {
		return res.status(404).json({ message: 'Product hasn\'t been found' });
	}

	res.status(200).json({ productToUpdate, newValues });

}

module.exports = {
	getAllProducts,
	getProductById,
	addProduct,
	deleteProduct,
	updateProduct
}