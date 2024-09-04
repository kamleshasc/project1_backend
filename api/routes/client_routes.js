const express = require("express");
const clientController = require("../../controller/clientController");

const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

// Create new client
router.post("/", verifyJWT, clientController.createClient);

//Get new client from database
router.get("/", verifyJWT, clientController.getClient);

//Update client by id
router.put("/:id", verifyJWT, clientController.updateClient);

//Get single client by id
router.get("/:id", verifyJWT, clientController.getClientById);
module.exports = router;
