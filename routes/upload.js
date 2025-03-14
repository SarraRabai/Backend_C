const express = require("express");
const multer = require("multer");
const router = express.Router();

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Route pour uploader une image
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    console.log("Requête d'upload reçue"); // Log pour déboguer
    console.log("Fichier reçu :", req.file); // Log pour déboguer

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé." });
    }

    const fileUrl = `http://localhost:${process.env.PORT || 9000}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ url: fileUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image :", error);
    res.status(500).json({ message: "Erreur lors de l'upload de l'image" });
  }
});

module.exports = router;
