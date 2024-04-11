const express = require("express");
const cors = require("cors");

const app = express();

const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.json());
app.use(cors());
require("./src/routes/router")(app);

app.get("/", (req, res) => {
  res.json({ message: "Hello from the API!" ,ip, port});
});




const ip = process.env.IP;
const port = process.env.PORT;

app.listen(port, ip, function () {
  console.log(`CORS-enabled web server listening on http://${ip}:${port}`);
});

