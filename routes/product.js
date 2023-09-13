
const {
	getAllProducts,
	getProductById,
	addProduct,
	deleteProduct,
	updateProduct,
} = require('../controllers/productControllers');

const express = require('express');
const router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', addProduct);

router.delete('/:id', deleteProduct);

router.patch('/:id', updateProduct);

module.exports = router;