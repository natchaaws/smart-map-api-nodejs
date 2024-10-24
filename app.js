// smart-map-api-nodejs\app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const helmet = require("helmet");

const passport = require("./src/middlewares/passport"); // Import passport middleware
const pool = require("./src/config/database");
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  lookup: ["connection.remoteAddress"],
  windowMs: 1 * 60 * 1000, // หน่วยเวลาเป็น มิลลิวินาที ในนี้คือ 1 นาที (1000 มิลลิวินาที = 1 วินาที)
  max: 100, // จำนวนการเรียกใช้สูงสุดต่อ IP Address ต่อเวลาใน windowMS
  standardHeaders: true, // คืน rate limit ไปยัง `RateLimit-*` ใน headers
  legacyHeaders: false, // ปิด `X-RateLimit-*` ใน headers

});

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(limiter); //ใช้ middleware ทำ rate limit
app.use(passport.initialize()); // Initialize passport middleware
app.use(express.urlencoded({ extended: true }));

// routes
const mainRouter = require("./src/routes/router");
app.use(mainRouter); // ใช้เส้นทางที่รวมไว้ใน router

const apiVersion1 = process.env.API_VERSION_1;
app.get(`${apiVersion1}/health-check`, async (req, res) => {
  try {
    const client = await pool.connect(); // Attempt to connect to the database
    await client.query('SELECT 1'); // Run a simple query to check the connection
    client.release(); // Release the client back to the pool
    res.status(200).json({ success: true, status: 200, message: `Database connection successful,${process.env.HOST, process.env.PORT_DB}` });
  } catch (err) {
    console.error('Error checking database connection:', err);
    res.status(500).json({ status: 500, success: false, message: 'Database connection failed', error: err.message });
  }
});
app.get('/', (req, res) => {
  // res.send('SmartMap API is running');
  res.json({status: 200, message: "10 PSIM Service Api is running" });
});

app.get(`${apiVersion1}/`, (req, res) => {
  res.json({ message: "Hello from the API!", ip, port });
});

const ip = process.env.IP || '0.0.0.0';
const port = process.env.PORT;

app.listen(port, ip, function () {
  console.log(`CORS-enabled web server listening on http://${ip}:${port}`);
});
