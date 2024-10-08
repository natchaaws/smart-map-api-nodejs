// src/routes/userRoutes.js
const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const usersController = require("../controllers/usersController.js");
const { userByid } = require('../controllers/authController.js');

const router = express.Router();
const apiVersion1 = process.env.API_VERSION_1;

 // Users
 router.post(`${apiVersion1}/users/user`,jwtMiddleware, userByid);
 router.post(
    `${apiVersion1}/users/page`,jwtMiddleware,
    upload.none(),
    usersController.getUsersPage
  );
  router.post(
    `${apiVersion1}/users/roles`,jwtMiddleware,
    upload.none(),
    usersController.editUserRole
  );
  router.post(
    `${apiVersion1}/users/delete`,jwtMiddleware,
    upload.none(),
    usersController.deleteUser
  );
module.exports = router;
