const { BulidingModel } = require("../models/buildingModel");

/* BulidMarker */
const createBulidMarker = async (req, res) => {
  const buildValues = req.body;
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
      error,
    });
  }
};

const editBulidMarker = async (req, res) => {
  const buildValues = req.body;
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

/* BulidFloor */
const createBulidFloor = async (req, res) => {
  const floorValues = req.body;
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
  const floorValues = req.body;
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
  const LocationfloorValues = req.body;
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
  const LocationfloorValues = req.body;
  try {
    const LocationFloor = await BulidingModel.editLocationFloor(
      LocationfloorValues
    );
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

module.exports = {
  createBulidMarker,
  editBulidMarker,
  createBulidFloor,
  editBulidFloor,
  createLocationFloor,
  editLocationFloor,
  getBulidPage,
  getFloorPage,
  getBuildOnMap,
};
