const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const { getEvents } = require('../controllers/websocketController');

const apiVersion1 = process.env.API_VERSION_1;

router.post(
    `${apiVersion1}/events/page`,
    jwtMiddleware,
    upload.none(),
    getEvents
);

module.exports = router;
