const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage(
	{
		destination: (req, file, cb) => {
			cb(null, 'public/');
		},
		filename: (req, file, cb) => {
			cb(null, nameFile(req, file));
		}
	}
);

//Allowed max image size in Mb
const size = 5;

//Image counter per product-includes serial number of image uploaded to image name
let counter = 1;

//Create image name on upload by the model: productName-imgNo.ext
const nameFile = (req, file) => {
	const nn = req.body.name + '-img' + counter++ + path.extname(file.originalname);
	return nn;
}

//Exclude from the upload files that don't belong to allowed types
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
			fileSize: 1024 * 1024 * size
		},
		fileFilter: fileTypeFilter
	}
).fields([{ name: 'prodImage', maxCount: 1 }, { name: 'addImages', maxCount: 3 }]);

module.exports = upload;
