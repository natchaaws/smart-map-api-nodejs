// src/routes/buildsRoutes.js
const express = require("express");
const multer = require("multer");
const buildingController = require("../controllers/buildingController.js");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, dest: "uploads/" });
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const apiVersion1 = process.env.API_VERSION_1;


// Buildings
router.post(
  `${apiVersion1}/buildings/mark`, jwtMiddleware,
  upload.none(),
  buildingController.createBulidMarker
);
router.post(
  `${apiVersion1}/buildings/remark`, jwtMiddleware,
  upload.none(),
  buildingController.editBulidMarker
);
router.post(
  `${apiVersion1}/buildings/mark/delete/:id`, jwtMiddleware,
  upload.none(),
  buildingController.deleteBuildingMarker
);
router.post(
  `${apiVersion1}/buildings/marks/floor`, jwtMiddleware,
  upload.none(),
  buildingController.createBulidFloor
);
router.post(
  `${apiVersion1}/buildings/marks/refloor`, jwtMiddleware,
  upload.none(),
  buildingController.editBulidFloor
);
router.post(
  `${apiVersion1}/buildings/marks/floors/location`, jwtMiddleware,
  upload.none(),
  buildingController.createLocationFloor
);
router.post(
  `${apiVersion1}/buildings/marks/floors/relocation`, jwtMiddleware,
  upload.none(),
  buildingController.editLocationFloor
);
router.post(`${apiVersion1}/buildings/page`, jwtMiddleware, upload.none(), buildingController.getBulidPage);
router.post(`${apiVersion1}/buildings/floors/page`, jwtMiddleware, upload.none(), buildingController.getFloorPage);
router.post(`${apiVersion1}/buildings/floors/location/page`, jwtMiddleware, upload.none(), buildingController.getLocationPage);

router.post(`${apiVersion1}/buildings/floors/img`, upload.none(), jwtMiddleware, buildingController.getImgByFloorId);
router.post(
  `${apiVersion1}/buildings/floors/position`, jwtMiddleware,
  upload.none(),
  buildingController.getPositionByFloorId
);

router.post(
  `${apiVersion1}/buildings/maps/location`, jwtMiddleware,
  upload.none(),
  buildingController.getBuildOnMap
);
router.post(
  `${apiVersion1}/buildings/floors`, jwtMiddleware,
  upload.none(),
  buildingController.getFloorSelect
);
module.exports = router;
