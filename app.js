require("dotenv/config");
const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');

app.use(cors());
app.options("*", cors());

const api = process.env.API_URL;
const dbName = process.env.DB_NAME;

const productsRouter = require('./routes/product');
const searchRouter = require('./routes/search');
const categoriesRouter = require('./routes/categories');

// Middleware
app.use(express.json());
app.use(logger("tiny"));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/public', express.static('public'));

app.use(`${api}/products`, productsRouter);
app.use(`${api}/search`, searchRouter);
app.use(`${api}/categories`, categoriesRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: dbName,
  })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
