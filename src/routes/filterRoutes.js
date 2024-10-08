// src/routes/filterRoutes.js
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const permissionsController = require("../controllers/permissionsController.js");
const filterController = require('../controllers/filterController');
const router = express.Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const apiVersion1 = process.env.API_VERSION_1;


// Filter 
router.get(`${apiVersion1}/filter/roles`,jwtMiddleware, permissionsController.getRole);
router.post(
    `${apiVersion1}/filter/geographies`,
    upload.none(),
    filterController.getGeographies
);
router.post(
    `${apiVersion1}/filter/provinces`,jwtMiddleware,
    upload.none(),
    filterController.getProvinces
);
router.post(
    `${apiVersion1}/filter/amphures`,jwtMiddleware,
    upload.none(),
    filterController.getAmphures
);
router.post(
    `${apiVersion1}/filter/tambons`,jwtMiddleware,
    upload.none(),
    filterController.getTambons
);
router.post(`${apiVersion1}/filter/cameras/locations`,jwtMiddleware, upload.none(), filterController.getCameraSelect);


module.exports = router;