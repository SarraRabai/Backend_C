const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwtPrivateKey"
    );
    if (!payload) {
      return res.status(401).send({ error: "Unauthorized. Invalid token." });
    }
    const user = await User.findById(payload.userId).select("-password");
    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    req.user = {
      _id: user._id, 
      userId: user._id, 
      name: user.name, 
      cin: user.cin, 
    };
    next();
  } catch (err) {
    res.status(400).send({ error: "Invalid token." });
  }
};
