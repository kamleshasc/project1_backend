const express = require("express");
const inventoryController = require("../../controller/inventoryController");

const router = express.Router();

//Add new Inventory to the database
router.post("/", inventoryController.createInventory);

//Get all Inventory data from database
router.get("/", inventoryController.getInventory);

//Update Inventory details
router.put("/:id", inventoryController.updateInventory);

//Get Inventory by id
router.get("/:id", inventoryController.getInventoryById);

module.exports = router;
