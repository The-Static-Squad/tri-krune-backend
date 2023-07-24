require("dotenv/config");
const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");

const api = process.env.API_URL;

// Middleware
app.use(express.json());
app.use(logger("tiny"));

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  price: Number,
});

const Product = mongoose.model("Product", productSchema);

app.get(`${api}/products`, async (req, res) => {
  const productsList = await Product.find();

  if(!productsList) {
    res.status(500).json({success: false});
  }

  res.send(productsList);

});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(200).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({ error: err, success: false });
    });

});

mongoose
  .connect(process.env.CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
