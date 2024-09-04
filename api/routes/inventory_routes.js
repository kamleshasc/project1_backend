const express = require("express");
const inventoryController = require("../../controller/inventoryController");

const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

//Add new Inventory to the database
router.post("/", verifyJWT, inventoryController.createInventory);

//Get all Inventory data from database
router.get("/", verifyJWT, inventoryController.getInventory);

//Update Inventory details
router.put("/:id", verifyJWT, inventoryController.updateInventory);

//Get Inventory by id
router.get("/:id", verifyJWT, inventoryController.getInventoryById);

module.exports = router;
