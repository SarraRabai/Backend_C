const express = require("express");
const multer = require("multer");
const router = express.Router();
const cloudinary = require("../utils/cloudinary");

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route pour uploader des images et des fichiers vocaux
router.post("/upload", upload.array("files", 10), async (req, res) => {
  console.log("Requête reçue sur /upload");
  console.log("Nombre de fichiers reçus :", req.files?.length || 0);
  console.log("Détails des fichiers :", req.files);
  try {
    // console.log("Requête d'upload reçue");

    // Vérifier si des fichiers ont été téléchargés
    if (!req.files || req.files.length === 0) {
      console.log("Aucun fichier détecté dans la requête");
      return res.status(400).json({ error: "Aucun fichier téléchargé." });
    }

    // Uploader chaque fichier sur Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const isImage = file.mimetype.startsWith("image/");
      const isAudio = file.mimetype.startsWith("audio/");
      console.log("Traitement du fichier :", file.originalname, file.mimetype);

      if (!isImage && !isAudio) {
        throw new Error(
          "Les fichiers doivent être des images ou des fichiers audio."
        );
      }

      const fileBase64 = file.buffer.toString("base64");
      const fileUri = `data:${file.mimetype};base64,${fileBase64}`;

      const uploadOptions = {
        resource_type: isImage ? "image" : "video", // "video" pour les fichiers audio sur Cloudinary
        folder: isImage ? "constats/images" : "constats/voices",
      };

      console.log("Upload vers Cloudinary :", uploadOptions);

      const result = await cloudinary.uploader.upload(fileUri, uploadOptions);
      console.log("URL Cloudinary :", result.secure_url);
      return result.secure_url;
    });

    const urls = await Promise.all(uploadPromises);
    console.log("Réponse envoyée :", { urls });
    res.status(200).json({ urls }); // Retourner un tableau d'URLs
  } catch (error) {
    console.error("Erreur lors de l'upload :", error.message, error.stack);
    res.status(500).json({ error: error.message || "Erreur lors de l'upload" });
  }
});

module.exports = router;
