// controllers/Controller.js
const express = require("express");
const { CameraModel, CameraPageModel } = require("../models/CameraModel");

// Define a route and its handler
// Camera.get("/endpoint", (req, res) => {
//   res.json({ message: "Hello from the API!" });
// });

// const getAllCameras = (req, res) => {
//   CameraModel.getAllCameras((err, cameras) => {
//     if (err) {
//       console.error(err);
//       res.json({ success: false, message: "Internal server error" });
//     } else {
//       res.json({ success: true, status: 200, data: cameras });
//       console.log("Show Camera Successfully!");
//     }
//   });
// };

const getAllCameras = async (req, res) => {
  try {
    const cameras = await CameraModel.getAllCameras();
    res.json({ success: true, status: 200, data: cameras });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getDistrict = async (req, res) => {
  try {
    const district = await CameraModel.getDistrict();
    res.json({ success: true, status: 200, data: district });
    console.log("Show District Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// const getDistrict = (req, res) => {
//   CameraModel.getDistrict((err, district) => {
//     if (err) {
//       console.error(err);
//       res.json({ success: false, message: "Internal server error" });
//     } else {
//       res.json({ success: true, status: 200, data: district });
//       console.log("Show District Successfully!");
//     }
//   });
// };


const getAllPolygon = async (req, res) => {
  try {
    const cameras = await CameraModel.getAllPolygon();
    
    res.json({ success: true, status: 200, data: cameras });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



const saveCamera = async (req, res) => {
  try {
    const cameraData = req.body;
    await CameraModel.saveCamera(cameraData);
    console.log({ status: 200, success: true, message: "Saved successfully!" });
    res.status(200).json({ status: 200, success: true, message: "Saved successfully!" });
  } catch (error) {
    console.error("Error saving Camera data:", error);
    res.status(500).json({ status: 500, success: false, message: "Internal server error", error });
  }
};

const getCameraPage = async (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const perPage = parseInt(req.body.perPage) || 10;
  const searchWord = req.body.searchWord;

  try {
    const camerasPage = await CameraPageModel.getCamerasPage(
      page,
      perPage,
      searchWord
    );
    res.json(camerasPage);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

// module.exports = Camera;

module.exports = {
  saveCamera,
  getAllCameras,
  getCameraPage,
  getAllPolygon,
  getDistrict,
};
