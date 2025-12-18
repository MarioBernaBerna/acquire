
const express = require("express");
const router = express.Router();

const acquireController = require("../controllers/acquirecontroller");

// Contrato del servicio ACQUIRE
//router.get("/health", predictController.health);
//router.get("/ready", predictController.ready);
router.post("/data", acquireController.getKunnaMeta);
router.get("/health", acquireController.health);

module.exports = router;