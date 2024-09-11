// controllers/Controller.js
const express = require("express");
const fs = require("fs"); // Import the File System module
const { parse } = require("csv-parse"); // Import the correct function
const { CamerasModel } = require("../models/CameraModel");
const {
  getProvinceId,
  getAmphureId,
  getTambonId,
  getGeographyByProvinceId,
} = require("../services/LocationService");

// const uploadCsv = async (req, res) => {
//   try {
//     const fileBuffer = req.file.buffer; // รับไฟล์จากการอัพโหลด
//     // แปลง CSV จาก buffer
//     parse(fileBuffer, { delimiter: ",", columns: true }, async (err, data) => {
//       if (err) {
//         return res
//           .status(400)
//           .json({ message: "Error parsing CSV file.", error: err });
//       }

//         // วนลูปผ่านแถวในไฟล์ CSV เพื่อทำการค้นหาและบันทึกข้อมูล
//       for (const row of data) {
//         try {
//         // ค้นหาไอดีจังหวัด
//         const provinceId = await getProvinceId(row.province);

//         // ค้นหาไอดีอำเภอโดยใช้ provinceId
//         const amphureId = await getAmphureId(provinceId, row.amphure);

//         // ค้นหาไอดีตำบลโดยใช้ amphureId
//         const tambonId = await getTambonId(amphureId, row.tambon);

//          // เก็บข้อมูลที่ได้จากการค้นหา
//           const camerasValues = {
//             name: row.name,
//             rtsp_path: row.rtsp_path,
//             camera_lat: row.lat,
//             camera_lng: row.lng,
//             province_id: provinceId,
//             amphure_id: amphureId,
//             tambon_id: tambonId,
//             province_name: row.province,
//             amphure_name: row.amphure,
//             tambon_name: row.tambon,
//             created_by: req.body.created_by // เพิ่ม created_by จาก req.body
//           };

//           console.log(camerasValues);
//           await CamerasModel.createCamera(camerasValues);
//         } catch (fetchError) {
//           console.error("Error fetching location data:", fetchError);
//         }
//       }

//       res.status(200).json({
//         status: 200,
//         success: true,
//         message: "File uploaded and data saved successfully.",
//       });
//     });
//   } catch (error) {
//     console.error("Error processing file:", error);
//     res.status(500).json({ message: "Error processing file.", error });
//   }
// };

// /cameras/upload-csv
const uploadCsv = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer; // รับไฟล์จากการอัพโหลด
    // แปลง CSV จาก buffer
    parse(fileBuffer, { delimiter: ",", columns: true }, async (err, data) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error parsing CSV file.", error: err });
      }

      const failedRows = []; // เก็บแถวที่ไม่ถูกบันทึกลง DB

      // วนลูปผ่านแถวในไฟล์ CSV เพื่อทำการค้นหาและบันทึกข้อมูล
      for (const [index, row] of data.entries()) {
        try {
          // ค้นหาไอดีจังหวัด
          const provinceId = await getProvinceId(row.province);

          // ค้นหาไอดีอำเภอโดยใช้ provinceId
          const amphureId = await getAmphureId(provinceId, row.amphure);

          // ค้นหาไอดีตำบลโดยใช้ amphureId
          const tambonId = await getTambonId(amphureId, row.tambon);
          // ค้นหาไอดีภาคโดยใช้ amphureId
          const geographyId = await getGeographyByProvinceId(provinceId);

          // เก็บข้อมูลที่ได้จากการค้นหา
          const camerasValues = {
            name: row.name,
            rtsp_path: row.rtsp_path,
            camera_lat: row.lat,
            camera_lng: row.lng,
            geography_id: geographyId,
            province_id: provinceId,
            amphure_id: amphureId,
            tambon_id: tambonId,

            province_name: row.province,
            amphure_name: row.amphure,
            tambon_name: row.tambon,
            created_by: req.body.created_by, // เพิ่ม created_by จาก req.body
          };

          //  console.log(`Row ${index + 1}:`, camerasValues);
          await CamerasModel.createCamera(camerasValues);
        } catch (fetchError) {
          console.error(`Error processing row ${index + 1}:`, fetchError);
          failedRows.push({
            row: index + 1,
            data: row,
            error: fetchError.message,
          }); // เก็บแถวที่ไม่ถูกบันทึก
        }
      }

      if (failedRows.length > 0) {
        console.log("Failed rows:", failedRows);
      }

      res.status(201).json({
        status: 201,
        success: true,
        message: "File uploaded and data created successfully.",
        failEderror: failedRows, // ส่งข้อมูลแถวที่ไม่ถูกบันทึกกลับไปด้วย
      });
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ message: "Error processing file.", error });
  }
};
// /cameras/camera
const addCamera = async (req, res) => {
  try {
    const camerasValues = req.body;
    // เพิ่ม geography_id ลงใน camerasValues
    // ค้นหา geographyId จาก province_id ที่ส่งมาจาก req.body
    const provinceId = camerasValues.province_id;
    const geographyId = await getGeographyByProvinceId(provinceId);

    camerasValues.geography_id = geographyId;
    const newCamera = await CamerasModel.createCamera(camerasValues);
    console.log({
      status: 201,
      success: true,
      message: "Created successfully!",
    });
    res.status(201).json({
      status: 201,
      success: true,
      message: "Created successfully!",
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
// /cameras/camera/:id
const updateCamera = async (req, res) => {
  try {
    // const camerasEdit = req.body;
    const camera_id = req.params.id; // ดึง camera_id จาก URL
    const camerasEdit = {
      ...req.body, // รวมข้อมูลจาก body
      camera_id, // เพิ่ม camera_id จาก params ลงในข้อมูลที่ต้องการอัปเดต
    };
    // ค้นหา geographyId จาก province_id ที่ส่งมาจาก req.body
    const provinceId = camerasEdit.province_id;
    const geographyId = await getGeographyByProvinceId(provinceId);

    // เพิ่ม geographyId ลงในข้อมูลที่ต้องการแก้ไข
    camerasEdit.geography_id = geographyId;

    const UpdateCamera = await CamerasModel.editCamera(camerasEdit);
    console.log({
      status: 200,
      success: true,
      message: "Update Camera successfully!",
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Edit camera   successfully!",
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
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};

const getAllCameras = async (req, res) => {
  try {
    const cameras = await CamerasModel.getAllCameras();
    res.json({ success: true, status: 200, data: cameras });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};

// cameras/page
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
    res.status(200).json(camerasPage);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const addLiveCamera = async (req, res) => {
  try {
    const Values = req.body;
    const LiveCamera = await CamerasModel.addLiveCamera(Values);
    //console.log({ status: 200, success: true, message: "successfully!" });
    res.status(200).json(LiveCamera);
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
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const camerasData = await CamerasModel.getCamerasByIds(userId);

    res.json({ success: true, status: 200, data: camerasData });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};

const getDistrict = async (req, res) => {
  try {
    const district = await CamerasModel.getDistrict();
    res.json({ success: true, status: 200, data: district });
    console.log("Show District Successfully!");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
  }
};

const getAllPolygon = async (req, res) => {
  try {
    const cameras = await CamerasModel.getAllPolygon();

    res.json({ success: true, status: 200, data: cameras });
    console.log("Show Camera Successfully!");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Internal server error" });
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
  uploadCsv,
};
