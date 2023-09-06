const Product = require('../models/product');

const searchByText = async (req, res) => {
	const tempQuery = [];

	for (q in req.query) {
		tempQuery.push(req.query[q]);
	}

	const userQuery = new RegExp(tempQuery.join('|'), 'i');

	if (!userQuery || tempQuery.length === 0) {
		return res.status(400).json({ message: 'No search parameters' });
	}

	const searchedProducts = await Product.find(
		{
			$or: [
				{ name: { $regex: userQuery } },
				{ category: { $regex: userQuery } },
				{ tags: { $regex: userQuery } }
			]
		}
	)

	if (!searchedProducts || searchedProducts.length === 0) {
		return res.status(404).json({ message: 'there are no products that match your search' });
	}

	res.status(200).json(searchedProducts);
}

module.exports = {
	searchByText
}