// src/routes/permissionRoutes.js

const express = require('express');
const permissionsController = require('../controllers/permissionsController');
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const apiVersion1 = process.env.API_VERSION_1;


router.post(`${apiVersion1}/permissions`, jwtMiddleware, permissionsController.getPermistion);

module.exports = router;
