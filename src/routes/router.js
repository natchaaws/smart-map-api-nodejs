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

const router = express.Router();

router.use(authRoutes);

router.use(cameraRoutes);
router.use(filterRoutes);
router.use(buildingRoutes);
router.use(permissionRoutes);
router.use(notificationRoutes);
router.use(userRoutes);
router.use(streamRoutes)


// Applying jwtMiddleware to all routes that require authentication
// router.use("/user", jwtMiddleware, userRoutes);
// router.use("/cameras", jwtMiddleware, cameraRoutes);
// router.use("/filters", jwtMiddleware, filterRoutes);
// router.use("/buildings", jwtMiddleware, buildingRoutes);
// router.use("/notifications", jwtMiddleware, notificationRoutes);
// router.use("/streams", jwtMiddleware, streamRoutes);
module.exports = router;