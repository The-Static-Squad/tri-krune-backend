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
    return res.status(404).json({ message: "no products found" });
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
  // const data = req.body;
  // const product = new Product({ ...data });
  // console.log(data)

  // convert tags input from a string to an array
  // if (req.body.tags) {
  // 	product.tags = toArray(req.body.tags);
  // }

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
      const basePath = `${req.protocol}://${req.get("host")}/public/`;
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
      fs.rename(`public/${oldFilename}`, `public/${newFilename}`, (err) => {
        if (err) {
          console.error("Error renaming file:", err);
        } else {
          console.log("File renamed successfully.");
        }
      });
      product.images[position] = basePath + newFilename;
    }
  }

  // console.log(product.images)

  // if (req.files.addImages) {
  // 	req.files.addImages.forEach(image => {
  // 		product.pictures.push(image.path);
  // 	});
  // }

  // console.log(product)

  // if (req.files["prodImg"] && req.files["addImages"]) {
  //   const mainImg = images["prodImage"][0];
  //   const additionalImgs = images["addImages"];
  //   product.mainImg = mainImg.path;

  //   additionalImgs.forEach((image) => {
  //     product.pictures.push(image.path);
  //   });
  // }

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
  // const newValues = req.body;
  // for (let item of req.body.images) {
  //   console.log(JSON.parse(item));
  // }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res(400).json({ message: "invalid Id" });
  }

  const existingProduct = await Product.findById(id);

  if (!existingProduct) {
    return res.status(404).json({ message: "Product hasn't been found" });
  }

  let oldImagesPaths = existingProduct.images;
  // console.log(oldImagesPaths);
  let newImagesOrder = [];

  if (req.files.length > 0) {
    for (let image of req.files) {
      const basePath = `${req.protocol}://${req.get("host")}/public/`;
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
      fs.rename(`public/${oldFilename}`, `public/${newFilename}`, (err) => {
        if (err) {
          console.error("Error renaming file:", err);
        } else {
          console.log("File renamed successfully.");
        }
      });
      newImagesOrder[position] = basePath + newFilename;
    }
  }

  // console.log(newImagesOrder);

  if (req.body.images) {
    console.log(req.body.images)
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

      // console.log(newPath)
      // if(typeof req.body.images === 'string') {
      //   newPath.join('')
      // }

      // console.log(...newPath, position);
      // fs.rename(oldPath, newPath, (err) => {
      //   if (err) {
      //     console.error("Error renaming file:", err);
      //   } else {
      //     console.log("File renamed successfully.");
      //   }
      // });
      newImagesOrder[position] = newPath[0];
    }
  }
console.log(newImagesOrder)
  // for (newImage of newImagesOrder) {
  //   oldImagesPaths.forEach((oldImage) => {
  //     if (oldImage !== newImage) {
  //       console.log(oldImage);
  //     } else {
  //       // console.log(oldImage, image)
  //     }
  //   });
  // }

  for(oldImage of oldImagesPaths) {
    if(!newImagesOrder.includes(oldImage)) {
      let extractedOldImagePath = oldImage.split("/").slice(3).join("/");

      fs.unlink(extractedOldImagePath, (err) => {
        if (err) throw err;
        console.log(`${extractedOldImagePath} was deleted`);
      });

      // console.log(extractedOldImagePath)
    }
  }
  // let images;
  // // images = JSON.parse()
  // if (req.files.length > 0) {
  //   for (let image of req.files) {
  //     // product.images.push(image.path);
  //     console.log(image);
  //   }
  // }

  // console.log(product.images);
  /*  let oldMainImage = product.mainImg; //previosly set main image
  let oldAddImages = product.pictures; //previosly set additional images */

  const deleteErrors = [];

  //Handle main image update
  //************************
  //Check if the request holds the path of main image that should be kept
  /* if (!newValues.mainImg) {

		if (oldMainImage) {
			try {
				fs.unlinkSync(oldMainImage);
			} catch (err) {
				deleteErrors.push(err);
			}
		}

		if (req.files.prodImage) {
			newValues.mainImg = req.files.prodImage[0].path;
		} else {
			newValues.mainImg = '';
		}
	} */

  /* if (req.files.images) {
    if (req.files.images[0]) {
      if (oldMainImage) {
        try {
          fs.unlinkSync(oldMainImage);
        } catch (err) {
          deleteErrors.push(err);
        }
      }
      newValues.mainImg = req.files.images[0].path;
    }
  } else {
    newValues.mainImg = oldMainImage;
  } */

  //Handle additional images update
  //*******************************

  //Check if the request holds the paths of images that should be kept
  //Make sure to get an array
  /* 	if (!newValues.pictures) {
		//If there's no pictures to be saved, create an empty array
		newValues.pictures = [];
	} else {
		//If request holds a string of paths, convert it to array
		if (typeof newValues.pictures === "string") {
			newValues.pictures = newValues.pictures.split(',');
		}
	} */

  //Compare images' paths to be kept, sent by request body, with all previosly attached images' paths
  //Compare arrays of images already attached to previous product version and delete unnecessary
  /* oldAddImages.forEach(oldImg => {
		if (!newValues.pictures.includes(oldImg)) {
			try {
				fs.unlinkSync(oldImg);
			} catch (err) {
				deleteErrors.push(err);
			}
		}
	});

	//Check if new image(s) had been added to request
	//Add new image path(s) to the update values
	//The values in the second array respond to the product additional images
	//(Input field addImages provides an array of attached files; it is limited to max three values)
	if (req.files.addImages) {
		//Add paths of new images to update values
		newValues.pictures = newValues.pictures.concat(req.files.addImages.map(img => img.path));
	} */

  const tags = req.body.tags || "[]";

  let discountPrice = parseValue(req.body.discountPrice, 'number');
  let category = parseValue(req.body.category, 'string');

  // let category = parseValue(req.body.category);


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
  // res.status(200).json("cool");
  res.status(200).json({ productToUpdate });
};

module.exports = {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
};
