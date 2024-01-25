const jwt = require("jsonwebtoken");
require("dotenv").config();
const key = process.env.JWT_SECRET;
const createJWT = (user) => {
  let token = null;
  try {
    token = jwt.sign(user, key);
  } catch (err) {
    console.log(err);
  }
  console.log(token);
  return token;
};
const verifyToken = (token) => {
  let data = null;
  try {
    let decoded = jwt.verify(token, key);
    data = decoded;
  } catch (err) {
    console.log(err);
  }
  return data;
};
const checkUserJWT = (req, res, next) => {
  console.log("aaaaa");

  if (req.cookies && req.cookies.jwt) {
    const decoded = verifyToken(req.cookies.jwt);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      res.send({ err: "err", message: "chua dang nhap" });
    }
  } else {
    res.send({ err: "err", message: "chua dang nhap" });
  }
};
module.exports = { createJWT, verifyToken, checkUserJWT };
