// const Camera = require("../controllers/camerasController")
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const camerasController = require("../controllers/camerasController.js");
const streamController = require("../controllers/streamController.js");
const login = require("../controllers/loginController");
module.exports = (app) => {
  // app.use(Camera);
  app.use(login);

  app.get("/getCamera", camerasController.getAllCameras);
  app.get("/getPolygon", camerasController.getAllPolygon);
  app.get("/getDistrict", camerasController.getDistrict);

  
  app.post("/CameraPage", upload.none(), camerasController.getCameraPage);
  app.post("/addCamera", upload.none(), camerasController.addCamera);
  app.post("/updateCamera", upload.none(), camerasController.updateCamera);
  app.post("/CameraByidDistrict", upload.none(), camerasController.getCameraByidDistrict);
  
  app.post("/getAllCameraById", upload.none(), camerasController.getAllCameraById);
  
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
