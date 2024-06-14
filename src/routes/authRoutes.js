const express = require('express');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { register, login, verify,userByid} = require('../controllers/authController.js');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify', verify);
router.post('/getuserByid', userByid);

module.exports = router;
