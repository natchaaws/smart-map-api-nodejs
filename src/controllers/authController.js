// src\controllers\authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/userModel");
const pool = require("../config/database");
const register = async (req, res) => {
  try {
    const {
      name,
      lastname,
      tel,
      email,
      username,
      password,
      role_id: roleIdFromBody,
    } = req.body;
    const role_id = parseInt(roleIdFromBody) || 3;

    // Determine who created the user based on role_id
    let created_by;
    if (role_id === 1) {
      created_by = process.env.ROLE_ID_1;
    } else if (role_id === 2) {
      created_by = process.env.ROLE_ID_2;
    } else if (role_id === 3) {
      created_by = process.env.ROLE_ID_3;
    } else if (role_id === 99) {
      created_by = process.env.ROLE_ID_99;
    } else {
      created_by = null;
    }

    // Check if the username already exists in the database
    const existingUser = await usersModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Username already exists. Please try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = await usersModel.createUser(
      name,
      lastname,
      tel,
      email,
      username,
      hashedPassword,
      role_id,
      created_by
    );

    res.status(201).json({
      success: true,
      status: 201,
      message: "User registered successfully",
      id: user_id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, status: 500, message: "Error registering user" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersModel.getUserByUsername(username);
    const userIP = req.ip;

    if (!user) {
      await pool.query(
        "INSERT INTO login_logs (user_id, login_status, login_ip_address, description) VALUES ($1, $2, $3, $4)",
        [null, false, userIP, `No username information found. ${username}`]
      );
      return res.status(401).json({
        status: 401,
        success: false,
        message: "No username information found.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      await pool.query(
        "INSERT INTO login_logs (user_id, login_status, login_ip_address, description) VALUES ($1, $2, $3, $4)",
        [user.user_id, false, userIP, "The password is incorrect."]
      );
      return res.status(401).json({
        status: 401,
        success: false,
        message: "The password is incorrect.",
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role_id: user.role_id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" } // กำหนดเวลาหมดอายุของ token
    );
    await pool.query(
      "INSERT INTO login_logs (user_id, login_status, login_ip_address, description) VALUES ($1, $2, $3, $4)",
      [user.user_id, true, userIP, "Login success."]
    );

    res.json({
      status: 200,
      success: true,
      message: "login success",
      user_id: user.user_id,
      role_id: user.role_id,
      token, // ส่ง token กลับไปให้ผู้ใช้
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error logging in",
      error,
    });
  }
};

const verify = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: 401, success: false, message: "Token is missing" });
  }
  
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Token is invalid",
        err,
      });
    }
const expirationTime = new Date(decoded.exp * 1000); // Convert expiration to readable date format

    res.json({
      status: 200,
      success: true,
      message: "Token is valid",
      user_id: decoded.user_id,
      role_id: decoded.role_id,
      exp:decoded.exp,
      expires_at: expirationTime, // Add the expiration date to the response
    });
  });
};

const userByid = async (req, res) => {
  try {
    const { user_id } = req.body;
    const User = await usersModel.getUser(user_id);
    res.status(200).json({
      success: true,
      status: 200,
      message: "User show successfully",
      data: User,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, status: 500, message: "Error registering user" });
  }
};

module.exports = {
  register,
  login,
  verify,
  userByid,
};
