// src/routes/buildsRoutes.js
const express = require("express");
const multer = require("multer");
const buildingController = require("../controllers/buildingController.js");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, dest: "uploads/" });

const apiVersion1 = process.env.API_VERSION_1;


 // Buildings
 router.post(
    `${apiVersion1}/buildings/mark`,
    upload.none(),
    buildingController.createBulidMarker
  );
  router.post(
    `${apiVersion1}/buildings/remark`,
    upload.none(),
    buildingController.editBulidMarker
  );
  router.post(
    `${apiVersion1}/buildings/marks/floor`,
    upload.none(),
    buildingController.createBulidFloor
  );
  router.post(
    `${apiVersion1}/buildings/marks/refloor`,
    upload.none(),
    buildingController.editBulidFloor
  );
  router.post(
     `${apiVersion1}/buildings/marks/floors/location`,
    upload.none(),
    buildingController.createLocationFloor
  );
  router.post(
   `${apiVersion1}/buildings/marks/floors/relocation`,
    upload.none(),
    buildingController.editLocationFloor
  );
  router.post(`${apiVersion1}/buildings/page`, upload.none(), buildingController.getBulidPage);
  router.post(`${apiVersion1}/buildings/floors/page`, upload.none(), buildingController.getFloorPage);
  router.post(`${apiVersion1}/buildings/floors/location/page`, upload.none(), buildingController.getLocationPage);

  router.post(`${apiVersion1}/buildings/floors/img`, upload.none(), buildingController.getImgByFloorId);
  router.post(
    `${apiVersion1}/buildings/floors/position`,
    upload.none(),
    buildingController.getPositionByFloorId
  );

  router.post(
    `${apiVersion1}/buildings/maps/location`,
    upload.none(),
    buildingController.getBuildOnMap
  );
  router.post(
    `${apiVersion1}/buildings/floors`,
    upload.none(),
    buildingController.getFloorSelect
  );
  module.exports = router;
