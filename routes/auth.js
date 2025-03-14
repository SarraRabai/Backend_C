const express = require("express");
const router = express.Router();
const Joi = require("joi");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");
const jwt = require("jsonwebtoken");

const schema = {
  cin: Joi.string().required(), // CIN au lieu de l'email
  password: Joi.string().required().min(5),
};

router.post("/", validateWith(schema), async (req, res) => {
  const { cin, password } = req.body;

  // Trouver l'utilisateur par CIN
  const user = await usersStore.getUserByCin(cin);
  if (!user || user.password !== password) {
    return res.status(400).send({ error: "CIN ou mot de passe invalide." });
  }

  // Générer un token JWT
  const token = jwt.sign(
    { userId: user._id, name: user.name, cin },
    "jwtPrivateKey" // Clé secrète pour signer le token
  );

  res.send(token);
});

module.exports = router;
