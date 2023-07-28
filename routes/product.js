const {
	getAllProducts,
	getProductById,
	addProduct
} = require('../controllers/productControllers');

const express = require('express');
const router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById)

router.post('/', addProduct)

module.exports = router;