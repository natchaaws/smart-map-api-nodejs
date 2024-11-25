// src\middlewares\jwtMiddleware.js


const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: 401, message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: 401, message: "Token is invalid" });
    }

    // Token is valid, attach the decoded data to the request object
    req.userData = decoded;
  //  console.log("🚀 ~ jwt.verify ~  req.userData:",  req.userData)
    next(); // Move to the next middleware
  });
};

module.exports = jwtMiddleware;
