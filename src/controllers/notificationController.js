// src/controllers/notificationController.js
const { NotificationsModel } = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  const namecamera = req.body.camera;

  try {
    const camera = await NotificationsModel.getCheckCamera(namecamera);
    if (camera) {
      res.json({
        success: true,
        message: "Notification retrieved from camera",
        camera_id: camera.camera_id,
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Camera not found", camera_id: null });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: error.message,
        camera_id: null || "Internal server error",
      });
  }
};

const createNotification = async (req, res) => {
  const {
    type,
    camera,
    plate,
    country,
    timestamp_from,
    cropimg,
    fullimg,
  } = req.body;

  try {
    // Retrieve camera_id using the camera name
    const cameraData = await NotificationsModel.getCheckCamera(camera);
    console.log(cameraData);
    // if (!cameraData) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Camera not found", noti_id: null });
    // }

    const map_camera_id = cameraData ? cameraData.camera_id : null;

    // Create notification
    const noti_id = await NotificationsModel.createNotiSocket({
      type,
      map_camera_id,
      camera,
      plate,
      country,
      timestamp_from,
      cropimg,
      fullimg,
    });

    res.json({
      success: true,
      message: "Notification created successfully",
      noti_id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Internal server error", noti_id: null });
  }
};

module.exports = { getNotifications, createNotification };
