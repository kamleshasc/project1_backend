const express = require("express");
const clientController = require("../../controller/clientController");

const router = express.Router();

// Create new client
router.post("/", clientController.createClient);

//Get new client from database
router.get("/", clientController.getClient);

//Update client by id
router.put("/:id", clientController.updateClient);

//Get single client by id
router.get("/:id", clientController.getClientById);
module.exports = router;
