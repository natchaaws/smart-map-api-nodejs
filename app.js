const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const helmet = require("helmet");

const passport = require("./src/middlewares/passport"); // Import passport middleware

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  lookup: ['connection.remoteAddress'],
  windowMs: 1 * 60 * 1000, // หน่วยเวลาเป็น มิลลิวินาที ในนี้คือ 1 นาที (1000 มิลลิวินาที = 1 วินาที)
  max: 70, // จำนวนการเรียกใช้สูงสุดต่อ IP Address ต่อเวลาใน windowMS
  standardHeaders: true, // คืน rate limit ไปยัง `RateLimit-*` ใน headers
  legacyHeaders: false, // ปิด `X-RateLimit-*` ใน headers
});
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(limiter); //ใช้ middleware ทำ rate limit
app.use(passport.initialize()); // Initialize passport middleware

const authRoutes = require("./src/routes/authRoutes");
app.use(authRoutes);

const mainRouter = require("./src/routes/router");
mainRouter(app); // Ensure this is a function call

app.get("/", (req, res) => {
  res.json({ message: "Hello from the API!", ip, port });
});

const ip = process.env.IP;
const port = process.env.PORT;

app.listen(port, ip, function () {
  console.log(`CORS-enabled web server listening on http://${ip}:${port}`);
});
