// controllers/Controller.js
const express = require("express");
const { CamerasModel } = require("../models/CameraModel");

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

// const getAllCameras = async (req, res) => {
//   try {
//     const cameras = await CameraModel.getAllCameras();
//     res.json({ success: true, status: 200, data: cameras });
//     console.log("Show Camera Successfully!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// const getCamerasByDistrict = async (req, res) => {
//   try {
//     const cameras = await CameraModel.getAllCameras();
//     res.json({ success: true, status: 200, data: cameras });
//     console.log("Show Camera Successfully!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// const getDistrict = async (req, res) => {
//   try {
//     const district = await CameraModel.getDistrict();
//     res.json({ success: true, status: 200, data: district });
//     console.log("Show District Successfully!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
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

// const getAllPolygon = async (req, res) => {
//   try {
//     const cameras = await CameraModel.getAllPolygon();

//     res.json({ success: true, status: 200, data: cameras });
//     console.log("Show Camera Successfully!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// const saveCamera = async (req, res) => {
//   try {
//     const cameraData = req.body;
//     await CameraModel.saveCamera(cameraData);
//     console.log({ status: 200, success: true, message: "Saved successfully!" });
//     res
//       .status(200)
//       .json({ status: 200, success: true, message: "Saved successfully!" });
//   } catch (error) {
//     console.error("Error saving Camera data:", error);
//     res
//       .status(500)
//       .json({
//         status: 500,
//         success: false,
//         message: "Internal server error",
//         error,
//       });
//   }
// };

// const getCameraPage = async (req, res) => {
//   const page = parseInt(req.body.page) || 1;
//   const perPage = parseInt(req.body.perPage) || 10;
//   const searchWord = req.body.searchWord;

//   try {
//     const camerasPage = await CameraPageModel.getCamerasPage(
//       page,
//       perPage,
//       searchWord
//     );
//     res.json(camerasPage);
//   } catch (error) {
//     res.status(500).json({ error: error.message || "Internal server error" });
//   }
// };

// module.exports = Camera;

const addCamera = async (req, res) => {
  try {
    const camerasValues = req.body;
    const newCamera = await CamerasModel.createCamera(camerasValues);
    console.log({ status: 200, success: true, message: "Saved successfully!" });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Saved successfully!",
      Camera: newCamera,
    });
  } catch (error) {
    console.error("Error saving Camera data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const updateCamera = async (req, res) => {
  try {
    const camerasEdit= req.body;
    const UpdateCamera = await CamerasModel.editCamera(camerasEdit);
    console.log({ status: 200, success: true, message: "Update  successfully!" });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Update successfully!",
      Camera: UpdateCamera,
    });
  } catch (error) {
    console.error("Error Update  Camera data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};


const getCameraByidDistrict = async (req, res) => {
  const id = req.body.dis_id;
  try {
    const CameraByid = await CamerasModel.getDistrictByid(id);
    res.json(CameraByid);
    console.log("Show Camera by District Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllCameras = async (req, res) => {
  try {
    const cameras = await CamerasModel.getAllCameras();
    res.json({ success: true, status: 200, data: cameras });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getDistrict = async (req, res) => {
  try {
    const district = await CamerasModel.getDistrict();
    res.json({ success: true, status: 200, data: district });
    console.log("Show District Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllPolygon = async (req, res) => {
  try {
    const cameras = await CamerasModel.getAllPolygon();

    res.json({ success: true, status: 200, data: cameras });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCameraPage = async (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const perPage = parseInt(req.body.perPage) || 10;
  const searchWord = req.body.searchWord;

  try {
    const camerasPage = await CamerasModel.getCamerasPage(
      page,
      perPage,
      searchWord
    );
    res.json(camerasPage);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const addLiveCamera = async (req, res) => {
  try {
    const Values = req.body;
    const LiveCamera = await CamerasModel.addLiveCamera(Values);
    //console.log({ status: 200, success: true, message: "successfully!" });
    res.status(200).json( LiveCamera);
  } catch (error) {
    console.error("Error saving Camera data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
const getAllCameraById = async (req, res) => {
  try {
    // Ensure req.body is an array of cameras
    //const cameras = Array.isArray(req.body.cameras) ? req.body.cameras : [req.body.cameras];
 const { userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }


    const camerasData = await CamerasModel.getCamerasByIds(userId);

    res.json({ success: true, status: 200, data: camerasData });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addCamera,
  updateCamera,
  getAllCameraById,
  addLiveCamera,
  getCameraByidDistrict,
  getAllCameras,
  getCameraPage,
  getAllPolygon,
  getDistrict,
};
