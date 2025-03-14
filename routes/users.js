const express = require("express");
const router = express.Router();
const Joi = require("joi");
const usersStore = require("../store/users");
const validateWith = require("../middleware/validation");
const auth = require("../middleware/auth");
const { addVehiculeToUser } = require("../store/users");

// Schéma de validation pour un véhicule
const vehiculeSchema = {
  registration: Joi.string().required(), // Immatriculation
  insuranceStartDate: Joi.date().required(), // Date de début d'assurance
  insuranceEndDate: Joi.date().required(), // Date de fin d'assurance
};

// Schéma de validation pour l'utilisateur
const userSchema = {
  name: Joi.string().required().min(2),
  cin: Joi.string().required(), // CIN au lieu de l'email
  password: Joi.string().required().min(5),
  vehicules: Joi.array()
    .items(
      Joi.object({
        registration: Joi.string().required(), // Immatriculation
        insuranceStartDate: Joi.date().required(), // Date de début d'assurance
        insuranceEndDate: Joi.date().required(), // Date de fin d'assurance
      })
    )
    .optional(), // Le champ "vehicles" est optionnel
};

// Route pour créer un utilisateur
router.post("/", validateWith(userSchema), async (req, res) => {
  const { name, cin, password, vehicules } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await usersStore.getUserByCin(cin);
  if (existingUser) {
    return res
      .status(400)
      .send({ error: "Un utilisateur avec ce CIN existe déjà." });
  }

  // Ajouter l'utilisateur
  const user = { name, cin, password, vehicules };
  const newUser = await usersStore.addUser(user);

  res.status(201).send(newUser);
});

// Route pour obtenir tous les utilisateurs
router.get("/", async (req, res) => {
  const users = await usersStore.getUsers();
  res.send(users);
});

// Route pour ajouter un véhicule à un utilisateur
router.post(
  "/:userId/vehicules",
  validateWith(vehiculeSchema),
  async (req, res) => {
    console.log("Requête reçue :", req.body); // Log du corps de la requête
    console.log("ID utilisateur :", req.params.userId); // Log de l'ID utilisateur

    const { userId } = req.params;
    const { registration, insuranceStartDate, insuranceEndDate } = req.body;

    try {
      const vehicule = {
        registration,
        insuranceStartDate,
        insuranceEndDate,
      };

      const updatedUser = await addVehiculeToUser(userId, vehicule);
      res.status(201).send(updatedUser);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

// Route pour obtenir les véhicules d'un utilisateur
router.get("/:userId/vehicules", auth, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await usersStore.getUserById(userId);
    if (!user) {
      return res.status(404).send({ error: "Utilisateur non trouvé." });
    }

    res.send(user.vehicules);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Erreur lors de la récupération des véhicules." });
  }
});

module.exports = router;
