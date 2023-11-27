const Product = require("../models/product");
const mongoose = require("mongoose");
const fs = require("fs");

function parseValue(value, type) {
  if(type === 'number') {
    return value === "null" ? 0 : value;
  } else if (type === 'string'){
    return value === "null" ? ' ' : value;;
  }
}

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort({ name: -1 });

  if (products.length === 0) {
    return res.status(200).json([])
    // return res.status(404).json({ message: "no products found" });
  }

  res.status(200).json(products);
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  //check if id matches mongoose pattern
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid Id" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json(product);
};

const addProduct = async (req, res) => {
  const tags = req.body.tags || "[]";
  let category = parseValue(req.body.category, "string");


  const product = new Product({
    name: req.body.name,
    category: category,
    description: req.body.description,
    price: req.body.price,
    discountPrice: req.body.discountPrice,
    tags: JSON.parse(tags),
    inStock: req.body.inStock,
    highlighted: req.body.highlighted,
  });

  if (req.files.length > 0) {
    for (let image of req.files) {
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      const oldFilename = image.filename;
      let position;
      const newFilename = oldFilename
        .split("+")
        .filter((el, index) => {
          if (index !== 1) {
            return true;
          } else {
            position = el;
            return false;
          }
        })
        .join("-");
      fs.rename(`public/uploads/${oldFilename}`, `public/uploads/${newFilename}`, (err) => {
        if (err) {
          console.error("Error renaming file:", err);
        } else {
          console.log("File renamed successfully.");
        }
      });
      product.images[position] = basePath + newFilename;
    }
  }

  try {
    const addedProduct = await product.save();
    res.status(201).json(addedProduct);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "invalid Id" });
  }

  const deletedProduct = await Product.findByIdAndRemove(id);

  if (!deletedProduct) {
    return res.status(404).json({ message: "No such product" });
  }

  const allImgs = deletedProduct.images;

  const deleteErrors = [];

  allImgs.forEach(image => {
  	try {
  		let extractedOldImagePath = image.split("/").slice(3).join("/");
      fs.unlink(extractedOldImagePath, (err) => {
        if (err) throw err;
        console.log(`${extractedOldImagePath} was deleted`);
      });
  	} catch (err) {
  		deleteErrors.push(err);
  	}
  });

  if (deleteErrors.length > 0) {
    return res.status(207).json({
      message: "Product deleted, with errors in deleting files",
      images_not_deleted: deleteErrors,
      deleted_product: deletedProduct,
    });
  }

  res.status(200).json(deletedProduct);
};

const updateProduct = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res(400).json({ message: "invalid Id" });
  }

  const existingProduct = await Product.findById(id);

  if (!existingProduct) {
    return res.status(404).json({ message: "Product hasn't been found" });
  }

  let oldImagesPaths = existingProduct.images;
  let newImagesOrder = [];

  if (req.files.length > 0) {
    for (let image of req.files) {
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      const oldFilename = image.filename;
      let position;
      const newFilename = oldFilename
        .split("+")
        .filter((el, index) => {
          if (index !== 1) {
            return true;
          } else {
            position = el;
            return false;
          }
        })
        .join("-");
      fs.rename(`public/uploads/${oldFilename}`, `public/uploads/${newFilename}`, (err) => {
        if (err) {
          console.error("Error renaming file:", err);
        } else {
          console.log("File renamed successfully.");
        }
      });
      newImagesOrder[position] = basePath + newFilename;
    }
  }

  if (req.body.images) {
    // console.log(req.body.images)
    for (let newImageOrder of req.body.images) {
      let position;
      
      if(typeof req.body.images === 'string') {
        newImageOrder = req.body.images;
      }

      const newPath = newImageOrder.split("+").filter((el, index) => {
        if (index !== 0) {
          return true;
        } else {
          position = el;
          return false;
        }
      });

      newImagesOrder[position] = newPath[0];
    }
  }

  for(oldImage of oldImagesPaths) {
    if(!newImagesOrder.includes(oldImage)) {
      let extractedOldImagePath = oldImage.split("/").slice(3).join("/");

      fs.unlink(extractedOldImagePath, (err) => {
        if (err) throw err;
        console.log(`${extractedOldImagePath} was deleted`);
      });
    }
  }

  const deleteErrors = [];
 
  const tags = req.body.tags || "[]";

  let discountPrice = parseValue(req.body.discountPrice, 'number');
  let category = parseValue(req.body.category, 'string');

  let productToUpdate = await Product.findByIdAndUpdate(id, {
    name: req.body.name,
    category: category,
    description: req.body.description,
    price: req.body.price,
    discountPrice: discountPrice,
    tags: JSON.parse(tags),
    images: newImagesOrder,
    inStock: req.body.inStock,
    highlighted: req.body.highlighted,
  });

  if (deleteErrors.length > 0) {
    return res.status(207).json({
      message: "Product deleted, with errors in deleting files",
      images_not_deleted: deleteErrors,
      newValues,
      productToUpdate,
    });
  }
  res.status(200).json({ productToUpdate });
};

const productCount = async (req, res) => {
  const productCount = await Product.countDocuments({});

  if (!productCount) {
    return res.status(200).json([])
  }

  res.status(200).json({ productCount: productCount });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  productCount,
};
