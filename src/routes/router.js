// src\routes\router.js
const express = require("express");
const jwtMiddleware = require('../middlewares/jwtMiddleware');
// routes
const authRoutes = require("./authRoutes");
const cameraRoutes = require('./camerasRoutes');
const filterRoutes = require('./filterRoutes');
const buildingRoutes = require('./buildsRoutes');
const permissionRoutes = require('./permissionRoutes');
const notificationRoutes = require('./notificationRoutes');
const userRoutes = require('./userRoutes');
const streamRoutes = require('./streamRoutes');
const eventsRoutes = require('./websocketRoutes');
const modbusRoutes = require('./modbusRoutes');
const router = express.Router();

router.use(authRoutes);

router.use(cameraRoutes);
router.use(filterRoutes);
router.use(buildingRoutes);
router.use(permissionRoutes);
router.use(notificationRoutes);
router.use(userRoutes);
router.use(streamRoutes)
router.use(eventsRoutes)
router.use(modbusRoutes)



module.exports = router;