const express = require("express");
const router = express.Router();
//const Joi = require("joi");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/User.js");

/*const schema = Joi.object({
  cin: Joi.string().required(),
  password: Joi.string().required().min(5),
});
*/
router.post("/", validateWith(userSchema), async (req, res) => {
  const { cin, password } = req.body;
  console.log("Tentative de connexion avec:", { cin, password }); // Log de débogage

  try {
    // Trouver l'utilisateur par CIN
    const user = await usersStore.getUserByCin(cin);
    if (!user || user.password !== password) {
      return res.status(400).send({ error: "CIN ou mot de passe invalide." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name, cin },
      process.env.JWT_SECRET || "jwtPrivateKey" // Clé secrète pour signer le token
    );
    console.log("Token généré:", token);
    res.json({
      ok: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          cin: user.cin,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du token:", error);
    res
      .status(500)
      .send({ error: "Une erreur s'est produite lors de la connexion." });
  }
});

module.exports = router;
