// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { register, login, verify, userByid } = require('../controllers/authController.js');

const apiVersion1 = process.env.API_VERSION_1;

router.post(`${apiVersion1}/auth/register`, register);
router.post(`${apiVersion1}/auth/login`, login);
router.post(`${apiVersion1}/auth/verify`, verify);

module.exports = router;
