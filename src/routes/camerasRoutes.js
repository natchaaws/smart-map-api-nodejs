// src/routes/camerasRoutes.js
const express = require("express");
const multer = require("multer");
const camerasController = require("../controllers/camerasController.js");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const apiVersion1 = process.env.API_VERSION_1;
// Cameras
router.get(`${apiVersion1}/cameras/polygon`, camerasController.getAllPolygon);
router.get(`${apiVersion1}/cameras/district`, camerasController.getDistrict);
router.post(
    `${apiVersion1}/cameras/district/:id`,
    upload.none(),
    camerasController.getCameraByidDistrict
);
router.post(
    `${apiVersion1}/cameras/AllCameraById`,
    upload.none(),
    camerasController.getAllCameraById
);
router.post(
    `${apiVersion1}/addLiveCamera`,
    upload.none(),
    camerasController.addLiveCamera
);

router.get(`${apiVersion1}/cameras`, camerasController.getAllCameras);
router.post(
    `${apiVersion1}/cameras/page`,
    upload.none(),
    camerasController.getCameraPage
);
router.post(
    `${apiVersion1}/cameras/camera`,
    upload.none(),
    camerasController.addCamera
);
router.post(
    `${apiVersion1}/cameras/camera/:id`,
    upload.none(),
    camerasController.updateCamera
);

router.post(
    `${apiVersion1}/cameras/upload-csv`,
    upload.single("file"),
    camerasController.uploadCsv
);


module.exports = router;