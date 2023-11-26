
const {
	getAllProducts,
	getProductById,
	addProduct,
	deleteProduct,
	updateProduct,
	productCount,
} = require('../controllers/productControllers');

const uploadMiddleWare = require('../middleware/upload');

const express = require('express');
const router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', uploadMiddleWare, addProduct);

router.delete('/:id', deleteProduct);

router.put('/:id', uploadMiddleWare, updateProduct);

router.get("/get/count", productCount);

module.exports = router;