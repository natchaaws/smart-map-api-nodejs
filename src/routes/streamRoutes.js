// src/routes/streamRoutes.js
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const streamController = require('../controllers/streamController');
const router = express.Router();
const apiVersion1 = process.env.API_VERSION_1;
const streamControllerInstance = new streamController();
  router.post(
    `${apiVersion1}/streams/start`,
    upload.none(),
    streamControllerInstance.startStream.bind(streamControllerInstance)
  );
  router.post(
    `${apiVersion1}/streams/stop`,
    upload.none(),
    streamControllerInstance.stopStream.bind(streamControllerInstance)
  );
  router.get(
    `${apiVersion1}/streams/status`,
    streamControllerInstance.getAllStatus.bind(streamControllerInstance)
  );

module.exports = router;
