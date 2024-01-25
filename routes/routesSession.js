const express = require("express");
const { getSession } = require("../controller/session");

const router = express.Router();

router.get("/", getSession);
module.exports = router;
