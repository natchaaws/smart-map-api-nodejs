// const Camera = require("../controllers/camerasController")
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const filterController = require("../controllers/filterController.js");
const camerasController = require("../controllers/camerasController.js");
const buildingController = require("../controllers/buildingController.js");
const streamController = require("../controllers/streamController.js");
// const login = require("../controllers/loginController");
module.exports = (app) => {
  // app.use(Camera);
 // app.use(login);

  // filter
  app.post(
    "/filterGeographies",
    upload.none(),
    filterController.getGeographies
  );
  app.post("/filterProvinces", upload.none(), filterController.getProvinces);
  app.post("/filterAmphures", upload.none(), filterController.getAmphures);
  app.post("/filterTambons", upload.none(), filterController.getTambons);

  // Building
  app.post(
    "/addBuildMark",
    upload.none(),
    buildingController.createBulidMarker
  );
  app.post(
    "/updateBulidMarker",
    upload.none(),
    buildingController.editBulidMarker
  );
  app.post(
    "/addBuildFloor",
    upload.none(),
    buildingController.createBulidFloor
  );
  app.post(
    "/updateBulidFloor",
    upload.none(),
    buildingController.editBulidFloor
  );
  app.post(
    "/addLocationFloor",
    upload.none(),
    buildingController.createLocationFloor
  );
  app.post(
    "/updateLocationFloor",
    upload.none(),
    buildingController.editLocationFloor
  );
  app.post(
    "/BulidPage",
    upload.none(),
    buildingController. getBulidPage
  );
  app.post(
    "/FloorPage",
    upload.none(),
    buildingController.getFloorPage
  );
  app.post(
    "/LocationPage",
    upload.none(),
    buildingController.getLocationPage
  );

  app.post(
    "/imgByFloorId",
    upload.none(),
    buildingController.getImgByFloorId
  );
  app.post(
    "/PositionById",
    upload.none(),
    buildingController.getPositionByFloorId
  );


  app.post("/getBuildOnMap", upload.none(),buildingController.getBuildOnMap);
  app.post("/getFloorById", upload.none(),buildingController.getFloorSelect);

  // cameras
  app.get("/getCamera", camerasController.getAllCameras);

  app.get("/getPolygon", camerasController.getAllPolygon);
  app.get("/getDistrict", camerasController.getDistrict);

  app.post("/CameraPage", upload.none(), camerasController.getCameraPage);
  app.post("/addCamera", upload.none(), camerasController.addCamera);
  app.post("/updateCamera", upload.none(), camerasController.updateCamera);
  app.post(
    "/CameraByidDistrict",
    upload.none(),
    camerasController.getCameraByidDistrict
  );


  app.post(
    "/getAllCameraById",
    upload.none(),
    camerasController.getAllCameraById
  );

  app.post("/addLiveCamera", upload.none(), camerasController.addLiveCamera);

  const streamControllerInstance = new streamController();

  // Call the startStream method on the instantiated object

  app.post(
    "/start-stream",
    upload.none(),
    streamControllerInstance.startStream.bind(streamControllerInstance)
  );
  app.post(
    "/stop-stream",
    upload.none(),
    streamControllerInstance.stopStream.bind(streamControllerInstance)
  );
  app.get(
    "/getStatus",
    streamControllerInstance.getAllStatus.bind(streamControllerInstance)
  );
};
