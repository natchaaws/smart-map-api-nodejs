const express = require("express");
const login = express.Router();
const pool = require("../config/database");
const bodyParser = require("body-parser"); // Import body-parser

const jsonParser = bodyParser.json();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
// Register a new user
login.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists in the database
    const existingUserQuery = `
        SELECT username
        FROM users
        WHERE username = $1
        `;
    const existingUser = await pool.query(existingUserQuery, [username]);

    if (existingUser.rows.length > 0) {
      // If a user with the same username already exists, respond with an error message
      console.log({ status: 400, message: "มีชื่อผู้ใช้แล้ว กรุณาลองใหม่" });
      return res.status(400).json({
        status: 400,
        message: "Username already exists. Please try again.",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      // Insert user data into the database
      const query = `
        INSERT INTO users (username, password)
        VALUES ($1, $2)
      `;
      await pool.query(query, [username, hashedPassword]);
      res
        .status(201)
        .json({ status: 201, message: "User registered successfully" });
      console.log({ status: 201, message: "User registered successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering user" });
  }
});

login.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Get the user's IP address from the request object
    const userIP = req.ip;
    // Query the database to get the user's information
    const query = "SELECT * FROM users WHERE username = $1";
    const { rows } = await pool.query(query, [username]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({status: 401, message: "No username information found." });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ status: 401, message: "The password is incorrect." });
    }

    // Create and send a JWT
    const token = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ username, token, "IP address is:": userIP });

    console.log(`Your IP address is: ${userIP}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

login.post("/verify", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid" });
    }

    // Token is valid, you can access the decoded data (e.g., decoded.username)
    res.json({ message: "Token is valid", decoded });
  });
});

// login.post('/authen', jsonParser, function (req, res) {
//     try {
//       const token = req.headers.authorization.split(' ')[1]
//       var decoded = jwt.verify(token, 'shhhhh')
//       res.json({ status: 'ok', decoded })
//     } catch (err) {
//       if (err.name === 'TokenExpiredError') {
//         // Token has expired
//         console.log("error", err)
//         res.status(401).json({ status: 'error', message: 'Token has expired' })
//       } else {
//         // Other JWT verification errors
//         console.log("error", err)
//         res.status(401).json({ status: 'error', message: err.message })
//       }
//     }
//   })

module.exports = login;
