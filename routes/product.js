
const {
	getAllProducts,
	getProductById,
	addProduct,
	deleteProduct,
	updateProduct,
} = require('../controllers/productControllers');

const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: 'public'})

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', upload.single('prodImage'), addProduct);

router.delete('/:id', deleteProduct);

router.patch('/:id', updateProduct);

module.exports = router;