const repair = require('../controllers/repairControllers');
const express = require('express');
const router = express.Router();

router.patch('/', repair);

module.exports = router;