const express = require("express");
const router = express.Router();
const {sendMessage,getMessages} = require("../controller/message");
const auth = require("../middleware/auth");

router.get("/:id", auth, getMessages);
router.post("/send/:id", auth, sendMessage);

module.exports = router;
