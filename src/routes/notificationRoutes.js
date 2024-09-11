//src/routes/notificationRoutes.js
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
const notificationsController = require("../controllers/notificationController.js");

const apiVersion1 = "/api/v1";

router.post(
    `${apiVersion1}/notifications/cameraname`,
    upload.none(),
    notificationsController.getCheckCameraNotifications
);
router.post(
    `${apiVersion1}/notifications/noti`,
    upload.none(),
    notificationsController.createNotification
);
router.get(
    `${apiVersion1}/filter/notifications/types`,
    upload.none(),
    notificationsController.getfilterTpyeNotic
);

router.post(
    `${apiVersion1}/notifications/page`,
    upload.none(),
    notificationsController.getNotifications
);

module.exports = router;