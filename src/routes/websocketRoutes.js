const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const { getEvents, getBodyFields, getPorts, getHeaders } = require('../controllers/websocketController');

const apiVersion1 = process.env.API_VERSION_1;

router.post(
    `${apiVersion1}/events/page`,
    jwtMiddleware,
    upload.none(),
    getEvents
);



router.get(
    `${apiVersion1}/filter/events/bodyfields`, jwtMiddleware,
    upload.none(),
    getBodyFields
);
// Route to get distinct ports
router.get(
    `${apiVersion1}/filter/events/ports`,
    jwtMiddleware,
    getPorts
);

// Route to get distinct headers
router.get(
    `${apiVersion1}/filter/events/headers`,
    jwtMiddleware,
    getHeaders
);

module.exports = router;
