// src\routes\router.js
const express = require("express");

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
router.use(streamRoutes);

module.exports = router;