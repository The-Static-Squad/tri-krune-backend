
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
const path = require('path');

const storage = multer.diskStorage(
	{
		destination: (req, file, cb) => {
			cb(null, 'public/');
		},
		filename: (req, file, cb) => {
			cb(null, req.body.name + "_main-img" + path.extname(file.originalname));
		}
	}
);

const fileTypeFilter = (req, imgFile, cllbck) => {
	const allowedTypes = ['jpg', 'jpeg', 'png'];
	const ext = path.extname(imgFile.originalname).slice(1).toLowerCase();
	const mime = imgFile.mimetype.split('/')[1].toLowerCase();

	if (allowedTypes.includes(ext) && allowedTypes.includes(mime)) {
		return cllbck(null, true)
	} else {
		cllbck(null, false)
	}
}

const upload = multer(
	{
		storage: storage,
		limits: {
			fileSize: 1024 * 1024 * 5
		},
		fileFilter: fileTypeFilter
	}
);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', upload.single('prodImage'), addProduct);

router.delete('/:id', deleteProduct);

router.patch('/:id', updateProduct);

module.exports = router;