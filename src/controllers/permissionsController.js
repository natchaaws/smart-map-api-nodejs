const permissionsModel = require("../models/permissionsModel");

const getRole = async (req, res) => {
  try {
    const roleFilter = await permissionsModel.getRole();
    res.json(roleFilter);
    console.log("Show  roleFilter Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getPermistion = async (req, res) => {
  const id = req.body.role_id;
  try {
    const Permistion = await permissionsModel.getPermis(id);
    res.json(Permistion);
    console.log("Show Permistion Successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getRole, getPermistion };
