// src/routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const usersController = require("../controllers/usersController.js");
const { userByid } = require('../controllers/authController.js');

const router = express.Router();
const apiVersion1 = process.env.API_VERSION_1;

 // Users
 router.post(`${apiVersion1}/users/user`, userByid);
 router.post(
    `${apiVersion1}/users/page`,
    upload.none(),
    usersController.getUsersPage
  );
  router.post(
    `${apiVersion1}/users/roles`,
    upload.none(),
    usersController.editUserRole
  );
  router.post(
    `${apiVersion1}/users/delete`,
    upload.none(),
    usersController.deleteUser
  );
module.exports = router;
