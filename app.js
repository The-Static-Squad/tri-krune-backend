require("dotenv/config");
const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");

const api = process.env.API_URL;
const productsRouter = require('./routes/product');
const searchRouter = require('./routes/search')

// Middleware
app.use(express.json());
app.use(logger("tiny"));

app.use(`${api}/products`, productsRouter);
app.use(`${api}/search`, searchRouter);

// const Product = require('./models/product');

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
