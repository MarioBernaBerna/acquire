// server.js
// Entry point del servicio ACQUIRE
require("dotenv").config();
const express = require("express");
const path = require("path");
const acquireRoutes = require("./routes/acquireRoutes");
const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/Practica3SOD";

//Conectar a MongoDB
mongoose.connect(mongoUri).then(() => {
  console.log("Conexión a la base de datos establecida")
}).catch((err) => {
  console.error("Error en la conexión a la base de datos:", err)
});

const PORT = process.env.PORT || 3002;

const app = express();
app.use(express.json());

// Rutas del servicio ACQUIRE
app.use("/", acquireRoutes);

// Arranque del servidor + carga del modelo
app.listen(PORT, async () => {
  const serverUrl = `http://localhost:${PORT}`;
  console.log(`[ACQUIRE] Servicio escuchando en ${serverUrl}`);
});