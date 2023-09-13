const Product = require('../models/product');
const mongoose = require('mongoose');

const getAllProducts = async (req, res) => {
	const products = await Product.find({}).sort({name: -1});

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

	const deletedProduct = await Product.findOneAndDelete({_id: id});

	if (!deletedProduct) {
		return res.status(404).json({ "message": "No such product" });
	}

	res.status(200).json(deletedProduct);
}

const updateProduct = async (req, res) => {
	const id = req.params.id;
	const newValues = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res(400).json({ message: 'invalid Id' });
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