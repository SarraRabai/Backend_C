const express = require("express");
const router = express.Router();
const constatStore = require("../store/constatStore");
const validateWith = require("../middleware/validation");
const constatSchema = require("../schemas/constatSchema");

// Ajouter un constat
router.post("/", validateWith(constatSchema), async (req, res) => {
  try {
    console.log("Requête d'ajout de constat reçue");
    console.log("Données reçues :", req.body);

    const newConstat = await constatStore.addConstat(req.body);
    console.log("Constat enregistré avec succès :", newConstat);

    res
      .status(201)
      .json({ message: "Constat enregistré avec succès", constat: newConstat });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du constat :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'enregistrement du constat" });
  }
});

// Récupérer un constat par ID
router.get("/:id", async (req, res) => {
  try {
    const constat = await constatStore.getConstatById(req.params.id);
    if (!constat) {
      return res.status(404).json({ message: "Constat non trouvé" });
    }
    res.status(200).json(constat);
  } catch (error) {
    console.error("Erreur lors de la récupération du constat :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du constat" });
  }
});

// Récupérer tous les constats
router.get("/", async (req, res) => {
  try {
    const constats = await constatStore.getAllConstats();
    res.status(200).json(constats);
  } catch (error) {
    console.error("Erreur lors de la récupération des constats :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des constats" });
  }
});

module.exports = router;
