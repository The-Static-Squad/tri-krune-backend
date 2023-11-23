const multer = require('multer');
const path = require('path');

const uploadFiles = (req, res, next) => {

	const storage = multer.diskStorage(
		{
			destination: (req, file, cb) => {
				cb(null, 'public/');
			},
			filename: (req, file, cb) => {
				cb(null, Date.now() + '+' + file.originalname );
			}
		}
	);

	//Allowed max image size in Mb
	const size = 5;

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
	);

	upload.array('images', 5)(req, res, (err) => {
		if (err) {
			return res.status(400).json({ error: "Upload failed", err });
		}
		next();
	});
}

module.exports = uploadFiles;
