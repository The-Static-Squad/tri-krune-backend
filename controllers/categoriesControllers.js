const mongoose = require('mongoose');
const Category = require('../models/categories');

const getCategories = async (req, res) => {
	const categories = await Category.find({}).sort({ name: 1 });

	if (categories.length === 0) {
		return res.status(404).json({message: "No categories found"})
	}

	res.status(200).json(categories);
}

const getCategory = async (req, res) => {
	const idToFind = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(idToFind)) {
		return res.status(400).json({message: "No such Id"})
	}
	const category = await Category.find({ _id: idToFind });

	if (!category) {
		return res.status(404).json({message: "Category with specified Id not found"})
	}

	res.status(200).json(category);
}

const addCategory = async (req, res) => {
	const categoryName = req.body.name;
	const newCategory = new Category({name:categoryName})

	try {
		const categoryAdded = await newCategory.save();
		res.status(201).json(categoryAdded);
	} catch (error) {
		res.status(400).json({message: error.message})
	}
}

const deleteCategory = async (req, res) => {

	const id = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({message: "Invalid Id"})
	}

	const deletedCategory = await Category.findOneAndDelete({ _id: id });

	if (!deletedCategory) {
		return res.status(404).json({message: "No catagory with specified Id"})
	}

	res.status(200).json(deletedCategory);
}

const updateCategory = async (req, res) =>{
	const idToUpdate = req.params.id;
	const newValue = req.body.name;

	if (mongoose.Types.ObjectId.isValid(idToUpdate)) {
		const categoryUpdated = await Category.findOneAndUpdate({ _id: idToUpdate }, {name: newValue});

		if (categoryUpdated) {
			return res.status(200).json({categoryUpdated, newValue});
		} else {
			return res.status(404).json({message: "No category with specified Id"})
		}
	} else {
		return res.status(400).json({message: "Invalid Id"})
	}
}

module.exports = {
	getCategories,
	getCategory,
	deleteCategory,
	addCategory,
	updateCategory
}