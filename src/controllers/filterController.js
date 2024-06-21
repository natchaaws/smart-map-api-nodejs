const express = require("express");
const filterModel = require("../models/filterModel");

const getGeographies = async (req, res) => {
  try {
    const geographies = await filterModel.getGeographies();
    res.json(geographies);
    console.log("Show  Geographies Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getProvinces = async (req, res) => {
  const id = req.body.geography_id;
  try {
    const provinces = await filterModel.getProvinces(id);
    res.json(provinces);
    console.log("Show Provinces Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAmphures = async (req, res) => {
  const id = req.body.province_id;
  try {
    const Amphures = await filterModel.getAmphures(id);
    res.json(Amphures);
    console.log("Show Amphures  Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getTambons = async (req, res) => {
  const id = req.body.amphure_id;
  try {
    const Tambons = await filterModel.getTambons(id);
    res.json(Tambons);
    console.log("Show Tambons  Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getCameraSelect = async (req, res) => {
  
  const pro_id = req.body.province_id;
  const am_id = req.body.amphure_id;
  const tam_id = req.body.tambol_id;
  try {
    const CameraSelect = await filterModel.getCameraSelects(pro_id,am_id,tam_id );
    res.json(CameraSelect);
    console.log("Show CameraSelect Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getGeographies,
  getProvinces,
  getAmphures,
  getTambons,
  getCameraSelect,
};
