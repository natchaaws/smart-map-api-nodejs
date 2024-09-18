// src/routes/camerasRoutes.js
const express = require("express");
const multer = require("multer");
const camerasController = require("../controllers/camerasController.js");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jwtMiddleware = require('../middlewares/jwtMiddleware');

const apiVersion1 = process.env.API_VERSION_1;
// Cameras
router.get(`${apiVersion1}/cameras/polygon`,jwtMiddleware, camerasController.getAllPolygon);
router.get(`${apiVersion1}/cameras/district`, camerasController.getDistrict);
router.post(
    `${apiVersion1}/cameras/district/:id`,jwtMiddleware,
    upload.none(),
    camerasController.getCameraByidDistrict
);
router.post(
    `${apiVersion1}/cameras/AllCameraById`,jwtMiddleware,
    upload.none(),
    camerasController.getAllCameraById
);
router.post(
    `${apiVersion1}/addLiveCamera`,jwtMiddleware,
    upload.none(),
    camerasController.addLiveCamera
);

router.get(`${apiVersion1}/cameras`,jwtMiddleware, camerasController.getAllCameras);
router.post(
    `${apiVersion1}/cameras/page`,jwtMiddleware,
    upload.none(),
    camerasController.getCameraPage
);
router.post(
    `${apiVersion1}/cameras/camera`,jwtMiddleware,
    upload.none(),
    camerasController.addCamera
);
router.post(
    `${apiVersion1}/cameras/camera/:id`,jwtMiddleware,
    upload.none(),
    camerasController.updateCamera
);

router.post(
    `${apiVersion1}/cameras/upload-csv`,jwtMiddleware,
    upload.single("file"),
    camerasController.uploadCsv
);


module.exports = router;