const express = require('express');
const router = express.Router();
const controller = require('../controllers/exampleController')
const bodyParser = require('body-parser')
router.get('/', controller.get);
router.post('/', bodyParser.urlencoded({ extended: false }), controller.post);
module.exports = router;