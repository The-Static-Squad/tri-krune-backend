const express = require('express');
const router = express.Router();
const {
	getCategories,
	getCategory,
	deleteCategory,
	addCategory,
	updateCategory
} = require('../controllers/categoriesControllers')

router.get('/', getCategories);

router.get('/:id', getCategory);

router.delete('/:id', deleteCategory);

router.post('/', addCategory);

router.patch('/:id', updateCategory);

module.exports = router;