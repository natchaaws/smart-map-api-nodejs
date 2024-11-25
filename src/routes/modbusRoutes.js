const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
const modbusController = require("../controllers/modbusController.js");
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const apiVersion1 = process.env.API_VERSION_1;
// : ดึงข้อมูล modbus_devices แบบแบ่งหน้า
router.post(
    `${apiVersion1}/modbus/devices/page`,
    jwtMiddleware,
    modbusController.getDevices
);

router.post(
    `${apiVersion1}/modbus/devices/:modbusId/messages/page`,
    jwtMiddleware,
    modbusController.getMessages
);
// POST: สร้างข้อมูลใหม่ใน modbus_devices
router.post(
    `${apiVersion1}/modbus/devices`,
    jwtMiddleware,
    upload.none(),

    modbusController.createDevice
);

// POST: สร้างข้อมูลใหม่ใน modbus_messages
router.post(
    `${apiVersion1}/modbus/devices/messages`,
    jwtMiddleware,
    upload.none(),
    modbusController.createMessage
);

router.put(
    `${apiVersion1}/modbus/devices/:modbusId/status`,
    jwtMiddleware,
    modbusController.updateStatus
);



// POST: แก้ไขข้อมูลใน modbus_devices
router.post(
    `${apiVersion1}/modbus/devices/:modbusId`,
    jwtMiddleware,
    upload.none(),
    modbusController.updateDevice
);

// POST: แก้ไขข้อมูลใน modbus_messages
router.post(
    `${apiVersion1}/modbus/devices/messages/:messageId`,
    jwtMiddleware,
    upload.none(),
    modbusController.updateMessage
);

// DELETE: ลบข้อมูล modbus_devices (soft delete)
router.delete(
    `${apiVersion1}/modbus/devices/:modbusId`,
    jwtMiddleware,
    modbusController.deleteDevice
);

// DELETE: ลบข้อมูล modbus_messages (soft delete)
router.delete(
    `${apiVersion1}/modbus/devices/messages/:messageId`,
    jwtMiddleware,
    modbusController.deleteMessage
);
module.exports = router;