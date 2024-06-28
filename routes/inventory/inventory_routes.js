const express = require("express");
const Inventory = require("../../database/models/inventory");

const router = express.Router();

//Add new Inventory to the database
router.post("/newInventory", async (req, res) => {
  try {
    const { name, quantity, unit, brand, price, stock, createdBy } = req.body;
    if (
      !name ||
      !quantity ||
      !unit ||
      !brand ||
      !price ||
      !stock ||
      !createdBy
    ) {
      return res
        .status(401)
        .json({ error: "Inventory all fields are required." });
    }
    const newInventory = new Inventory({
      name,
      quantity,
      unit,
      brand,
      price,
      stock,
      createdBy,
      updatedBy: createdBy,
    });
    await newInventory.save();
    return res.status(201).json(newInventory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error Adding New Inventory." });
  }
});

//Get all Inventory data from database
router.get("/getAllInventory", async (req, res) => {
  try {
    const getInventory = await Inventory.find()
      .populate("createdBy", {
        _id: 1,
        firstName: 1,
        lastName: 1,
      })
      .populate("updatedBy", {
        _id: 1,
        firstName: 1,
        lastName: 1,
      });
    return res.status(200).json(getInventory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error " });
  }
});

//Update Inventory details
router.put("/:id", async (req, res) => {
  try {
    const { name, quantity, unit, brand, price, stock, updatedBy } = req.body;
    if (
      !name ||
      !quantity ||
      !unit ||
      !brand ||
      !price ||
      !stock ||
      !updatedBy
    ) {
      return res
        .status(401)
        .json({ error: "Inventory all fields are required." });
    }
    const inventoryId = req.params.id;
    const updateBody = {
      name,
      quantity,
      unit,
      brand,
      price,
      stock,
      updatedBy,
    };
    const updateInventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      updateBody,
      { new: true }
    );

    if (!updateInventory) {
      return res.status(404).json({ error: "Inventory not found" });
    }

    return res.status(200).json(updateInventory);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error Updating Inventory." });
  }
});

//Get Inventory by id
router.get("/getInventoryById/:id", async (req, res) => {
  try {
    let inventoryId = req.params.id;
    const result = await Inventory.findById(inventoryId);
    if (!result) {
      return res.status(404).json({ error: "Inventory not found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
