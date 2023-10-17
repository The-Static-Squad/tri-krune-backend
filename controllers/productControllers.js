const Product = require('../models/product');
const mongoose = require('mongoose');
const fs = require('fs');
const { findById } = require('../models/categories');

const toArray = (str) => {
	return str.split(/[,\s]+/).filter(elem => elem);
}

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
		//split tag string on each , or whitespace (single or sequence)
		const tagArray = product.tags[0].split(/[,\s]+/);
		//ensure to exclude last empty string element, if tag string ends with , or whitespace
		tagArray.filter(tag => tag);
		product.tags = tagArray;
	}

	//add image paths to appropriate fields
	const images = req.files;
	if (images.length > 0) {
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
		return res.status(404).json({ message: 'invalid Id' });
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
		} catch (err) {
			deleteErrors.push(err);
		}
	});

	if (deleteErrors.length > 0) {
		return res.status(207).json({ message: "Product deleted, with errors in deleting files", images_not_deleted: deleteErrors, deleted_product: deletedProduct, })
	}

	res.status(200).json(deletedProduct);
}

const updateProduct = async (req, res) => {
	const id = req.params.id;
	const newValues = req.body;

	//Chceck if id passed as request parameter is valid mongodb id
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res(400).json({ message: 'invalid Id' });
	}

	//convert tags string to an array of tags
	if (newValues.tags) {
		newValues.tags = toArray(newValues.tags);
	}

	const product = await Product.findById(id);
	let oldMainImage = product.mainImg; //previosly set main image
	let oldAddImages = product.pictures; //previosly set additional images

	const deleteErrors = [];

	//Check if new images had been added to request
	//Find and delete from the base previosly attached images
	//Add new image paths to values to be updated
	if (req.files.length > 0) {
		//The first value in the first array responds to the product main image
		//(Input field prodImage provides an array of attached files; it is limited to one value)
		const newMainImg = req.files.prodImage[0];
		if (newMainImg) {

			//remove old main image from the base, if set
			if (oldMainImage) {
				try {
					fs.unlinkSync(oldMainImage);
				} catch (err) {
					deleteErrors.push(err);
				}
			}

			//Add path of new image to update values
			newValues.mainImg = newMainImg.path;
		}

		//The values in the second array respond to the product additional images
		//(Input field addImages provides an array of attached files; it is limited to max three values)
		const newAdditionalImages = req.files.addImages;

		if (newAdditionalImages.length > 0) {

			//Identify old images to be removed-
			//Compare images' paths to be kept, sent by request body, with all previosly attached images' paths
			//String of pictures to be kept recieved in req is converted to array
			if (!newValues.pictures) {
				//If there's no pictures to be saved, create an empty array
				newValues.pictures = [];
			} else {
				if (typeof newValues.pictures === "string") {
					newValues.pictures = newValues.pictures.split(',');
				}
			}

			//Compare arrays of images already attached to previous product version and delete unnecessary
			oldAddImages.forEach(oldImg => {
				if (!newValues.pictures.includes(oldImg)) {
					try {
						fs.unlinkSync(oldImg);
						console.log(oldImg + " deleted");
					} catch (err) {
						deleteErrors.push(err);
					}
				}
			});

			//Add paths of new images to update values
			newValues.pictures = newValues.pictures.concat(newAdditionalImages.map(img => img.path));
		}
	} else {
		//If no new images have been attached, and there are no images to keep in request
		//Delete old images from the base

		if (oldMainImage && !newValues.mainImg) {
			console.log(oldMainImage, newValues.mainImg)
			try {
				fs.unlinkSync(oldMainImage);
			} catch (err) {
				deleteErrors.push(err);
			}
		}

		if (oldAddImages.length > 0 && newValues.pictures.length===0) {
			console.log(oldAddImages, newValues.pictures)
			oldAddImages.forEach(oldImg => {
				try {
					fs.unlinkSync(oldImg);
				} catch (err) {
					deleteErrors.push(err);
				}
			});
		}
	}

	let productToUpdate = await Product.findOneAndUpdate({ _id: id }, { ...newValues });

	if (!productToUpdate) {
		return res.status(404).json({ message: 'Product hasn\'t been found', newVals: newValues.tags });
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