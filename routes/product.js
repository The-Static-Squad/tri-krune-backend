
const {
	getAllProducts,
	getProductById,
	addProduct,
	deleteProduct,
	updateProduct,
} = require('../controllers/productControllers');

const uploadMiddleWare = require('../middleware/upload');

const express = require('express');
const router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', uploadMiddleWare, addProduct);

router.delete('/:id', deleteProduct);

router.patch('/:id', uploadMiddleWare, updateProduct);

module.exports = router;