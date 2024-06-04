// const express = require("express");
// const login = express.Router();
// const pool = require("../config/database");
// const bodyParser = require("body-parser"); // Import body-parser

// const jsonParser = bodyParser.json();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // Register a new user
// login.post("/register", async (req, res) => {
//   try {
//     const { username, password, role_id: roleIdFromBody } = req.body;
//     const role_id = parseInt(roleIdFromBody) || 3;

//     // Determine who created the user based on role_id
//     let created_by;
//     if (role_id === 1) {
//       created_by = process.env.ROLE_ID_1;
//     } else if (role_id === 2) {
//       created_by = process.env.ROLE_ID_2;
//     } else if (role_id === 3) {
//       created_by = process.env.ROLE_ID_3;
//     } else if (role_id === 99) {
//       created_by = process.env.ROLE_ID_99;
//     } else {
//       created_by = null;
//     }

//     // Check if the username already exists in the database
//     const existingUserQuery = `
//         SELECT username
//         FROM users
//         WHERE username = $1
//         `;
//     const existingUser = await pool.query(existingUserQuery, [username]);

//     if (existingUser.rows.length > 0) {
//       // If a user with the same username already exists, respond with an error message
//       console.log({ status: 400, message: "มีชื่อผู้ใช้แล้ว กรุณาลองใหม่" });
//       return res.status(400).json({
//         status: 400,
//         message: "Username already exists. Please try again.",
//       });
//     } else {
//       const hashedPassword = await bcrypt.hash(password, 10);

//       const values = [username, hashedPassword, role_id, created_by];

//       // Insert user data into the database
//       const query = `
//         INSERT INTO users (username, password, role_id, created_by)
//         VALUES ($1, $2, $3,$4) RETURNING user_id
//       `;
//       const result = await pool.query(query, values);
//       const user_id = result.rows[0].user_id;
//       res.status(201).json({
//         status: 201,
//         message: "User registered successfully",
//         id: user_id,
//       });
//       console.log({
//         status: 201,
//         message: "User registered successfully",
//         id: user_id,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error registering user" });
//   }
// });

// login.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     // Get the user's IP address from the request object
//     const userIP = req.ip;
//     // Query the database to get the user's information
//     const query =
//       "SELECT * FROM users WHERE username = $1 AND is_delete = false";
//     const { rows } = await pool.query(query, [username]);
//     const user = rows[0];

//     if (!user) {
//       await pool.query(
//         "INSERT INTO login_logs (user_id, login_status, login_ip_address,description) VALUES ($1, $2, $3,$4)",
//         [null, false, userIP, `No username information found. ${username}`]
//       );
//       return res
//         .status(401)
//         .json({ status: 401, message: "No username information found." });
//     }

//     // Compare the provided password with the hashed password stored in the database
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (!passwordMatch) {
//       await pool.query(
//         "INSERT INTO login_logs (user_id, login_status, login_ip_address,description) VALUES ($1, $2, $3,$4)",
//         [user.user_id, false, userIP, "The password is incorrect."]
//       );
//       return res
//         .status(401)
//         .json({ status: 401, message: "The password is incorrect." });
//     }

//     // Create and send a JWT
//     const token = jwt.sign(
//       { user_id: user.user_id, username: user.username, role_id: user.role_id },
//       process.env.SECRET_KEY,
//       {
//         expiresIn: "1h",
//       }
//     );
//     await pool.query(
//       "INSERT INTO login_logs (user_id, login_status, login_ip_address,description) VALUES ($1, $2, $3,$4)",
//       [user.user_id, true, userIP, "Login success."]
//     );
//     const response = {
//       status: 200,
//       success: true,
//       message: "login success",
//       user_id: user.user_id,
//       // username: user.username,
//       // company_id: user.company_id,
//       role_id: user.role_id,
//       // isdelete: user.isdelete,
//       token,
//       ip_address: userIP, // Including the IP address in the response
//     };

//     res.json(response);

//     //console.log(`Login successful. User IP address is: ${userIP}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error logging in" });
//   }
// });

// login.post("/verify", (req, res) => {
//   const token = req.headers.authorization.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Token is missing" });
//   }

//   jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Token is invalid" });
//     }

//     // Token is valid, you can access the decoded data (e.g., decoded.username)

//     res.json({
//       status: 200,
//       success: true,
//       message: "Token is valid",
//       user_id: decoded.user_id,
//       role_id: decoded.role_id,
//     });
//   });
// });



// module.exports = login;
