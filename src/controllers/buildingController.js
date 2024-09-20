const { BulidingModel } = require("../models/buildingModel");

/* BulidMarker */
const createBulidMarker = async (req, res) => {
  const buildValues = {
    ...req.body,
    created_by: req.userData.username // กำหนดค่า created_by จาก req.userData.username
  };
  try {
    const BulidMarker = await BulidingModel.createBulidMarker(buildValues);
    res.status(200).json({
      status: 200,
      success: true,
      message: "BulidMarker successfully!",
      BulidMarker,
    });
  } catch (error) {
    console.error("Error insert  Bulid data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const editBulidMarker = async (req, res) => {
  const buildValues = { ...req.body, modified_by: req.userData.username };
  try {
    const BulidMarker = await BulidingModel.editBulidMarker(buildValues);
    res.status(200).json({
      status: 200,
      success: true,
      message: "BulidMarker successfully!",
      BulidMarker,
    });
  } catch (error) {
    console.error("Error insert  Bulid data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
// /buildings/mark/delete/:id
const deleteBuildingMarker = async (req, res) => {
  const id = parseInt(req.params.id);
  const deleted_by = req.userData.username;
  try {
    const result = await BulidingModel.deleteBulidMarker(deleted_by, id);
    if (result) {
      res.status(200).json({
        message: "Building marker deleted successfully",
        data: result
      });
    } else {
      res.status(404).json({ message: "Building marker not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};


/* BulidFloor */
const createBulidFloor = async (req, res) => {
  const floorValues = {
    ...req.body,
    created_by: req.userData.username
  };
  try {
    const BulidFloor = await BulidingModel.createBulidFloor(floorValues);
    res.status(200).json({
      status: 200,
      success: true,
      message: "BulidFloor successfully!",
      BulidFloor,
    });
  } catch (error) {
    console.error("Error insert Bulid data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const editBulidFloor = async (req, res) => {
  const floorValues = { ...req.body, modified_by: req.userData.username };
  try {
    const BulidFloor = await BulidingModel.editBulidFloor(floorValues);
    res.status(200).json({
      status: 200,
      success: true,
      message: "BulidFloor successfully!",
      BulidFloor,
    });
  } catch (error) {
    console.error("Error insert  Bulid data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

/* LocationFloor */
const createLocationFloor = async (req, res) => {
  const LocationfloorValues ={ ...req.body, created_by: req.userData.username }
  try {
    const BulidFloor = await BulidingModel.createLocationFloor(
      LocationfloorValues
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "LocationFloor successfully!",
      BulidFloor,
    });
  } catch (error) {
    console.error("Error insert LocationFloor data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const editLocationFloor = async (req, res) => {
  const LocationfloorValues = { ...req.body, modified_by: req.userData.username };
  //console.log(LocationfloorValues);
  try {
    const LocationFloor = await BulidingModel.editLocationFloor(
      LocationfloorValues
    );
    console.log("edit LocationFloor successfully!");
    res.status(200).json({
      status: 200,
      success: true,
      message: "LocationFloor successfully!",
      LocationFloor,
    });
  } catch (error) {
    console.error("Error insert  Bulid data:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

/* Bulid For Report */
const getBulidPage = async (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const perPage = parseInt(req.body.perPage) || 10;
  const searchWord = req.body.searchWord;

  try {
    const bulidPage = await BulidingModel.getBulidPage(
      page,
      perPage,
      searchWord
    );
    res.json(bulidPage);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

/* Floor For Table */
const getFloorPage = async (req, res) => {
  const building_id = req.body.building_id;
  const page = parseInt(req.body.page) || 1;
  const perPage = parseInt(req.body.perPage) || 10;
  const searchWord = req.body.searchWord;

  try {
    const floorPage = await BulidingModel.getFloorPage(
      building_id,
      page,
      perPage,
      searchWord
    );
    res.json(floorPage);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

/* Location For Table */
const getLocationPage = async (req, res) => {
  const floor_id = req.body.floor_id;
  const page = parseInt(req.body.page) || 1;
  const perPage = parseInt(req.body.perPage) || 10;
  const searchWord = req.body.searchWord;

  try {
    const LocationPage = await BulidingModel.getLocationPage(
      floor_id,
      page,
      perPage,
      searchWord
    );
    res.json(LocationPage);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

/* Bulid For map */

const getImgByFloorId = async (req, res) => {
  const floor_id = req.body.floor_id;
  try {
    const Floor = await BulidingModel.getImgByFloorId(floor_id);
    res.json(Floor);
    console.log("Show ImgByFloorId Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPositionByFloorId = async (req, res) => {
  const floor_id = req.body.floor_id;
  try {
    const FloorLocation = await BulidingModel.getPositionByFloorId(floor_id);
    res.json(FloorLocation);
    console.log("Show getPositionByFloorId Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* Bulid For map */

const getBuildOnMap = async (req, res) => {
  try {
    const Build = await BulidingModel.getBuildOnMap();
    res.json(Build);
    console.log("Show BuildOnMap Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getFloorSelect = async (req, res) => {
  const id = req.body.building_id;
  try {
    const FloorSelect = await BulidingModel.getFloorSelect(id);
    res.json(FloorSelect);
    console.log("Show getFloorSelect Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createBulidMarker,
  editBulidMarker,
  deleteBuildingMarker,
  createBulidFloor,
  editBulidFloor,
  createLocationFloor,
  editLocationFloor,
  getBulidPage,
  getFloorPage,
  getLocationPage,
  getImgByFloorId,
  getPositionByFloorId,
  getBuildOnMap,
  getFloorSelect,
};
