const express = require("express");
const router = express.Router();
const sendMessage = require("../store/message");
const auth = require("../middleware/auth");

router.post("/send/:id", auth, sendMessage);

module.exports = router;
