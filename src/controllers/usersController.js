//  src/controllers/usersController.js

const usersModel = require("../models/userModel");

const getUsersPage = async (req, res) => {
  const page = parseInt(req.body.page) || 1;
  const perPage = parseInt(req.body.perPage) || 10;
  const searchWord = req.body.searchWord || null;
  const searchRole = req.body.searchRole || null;

  try {
    const userValues = { page, perPage, searchWord, searchRole };
    const camerasPage = await usersModel.getAllUser(userValues);
    res.json(camerasPage);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const editUserRole = async (req, res) => {
  const user_id = parseInt(req.body.user_id);
  const newRole = req.body.role_id;

  try {
    const result = await usersModel.editUserRole(user_id, newRole);
    res.json({ success: true, message: "User role updated", result });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const user_id = parseInt(req.body.user_id);

  try {
    const result = await usersModel.deleteUser(user_id);
    res.json({ success: true, message: "User marked as deleted", result });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  getUsersPage,
  editUserRole,
  deleteUser,
};
