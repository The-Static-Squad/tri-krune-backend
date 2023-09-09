const Product = require('../models/product');
const mongoose = require('mongoose');


const clearDBase = async (req, res) => {

	const corrected = await Product.updateOne({}, {name:"title"});
	res.status(200).json(corrected);
}

module.exports = clearDBase;