const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const upload = require("./routes/upload");
const addConstat = require("./routes/addConstat");
const message = require("./routes/message");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
var bodyParser = require("body-parser");

const app = express();
// app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json({ strict: false }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.get("/", (req, res) => res.send("hello here !!"));
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/upload", upload);
app.use("/api/addConstat", addConstat);
app.use("/api/message", message);
// Configuration de MongoDB
const mongoURI = "mongodb://localhost:27017/DataBaseConstat"; // URI MongoDB directement dans le code

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connecté à MongoDB avec succès");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB :", err);
    process.exit(1); // Quitter l'application en cas d'échec de connexion
  });

const port = process.env.PORT || config.get("port");  
app.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});
