const { request } = require("express");

const express = require('express');
const { searchByText } = require("../controllers/searchControllers");
const router = express.Router();

router.get('/', searchByText);

module.exports = router;