const Inventory = require("../models/inventory");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");

exports.createInventory = async (req, res, next) => {
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
      // return res
      //   .status(401)
      //   .json({ error: "Inventory all fields are required." });
      return next(new ApiError(400, "All fields are required."));
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
    let response = new ApiResponse(201, newInventory);
    return res.json(response);
    // return res.status(201).json(newInventory);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error Adding New Inventory." });
    return next(
      new ApiError(500, error?.message || "Error Getting New Commission Rule.")
    );
  }
};

exports.getInventory = async (req, res, next) => {
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
    // return res.status(200).json(getInventory);
    let response = new ApiResponse(200, getInventory);
    return res.json(response);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error " });
    return next(
      new ApiError(500, error?.message || "Error Getting New Commission Rule.")
    );
  }
};

exports.updateInventory = async (req, res, next) => {
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
      // return res
      //   .status(401)
      //   .json({ error: "Inventory all fields are required." });
      return next(new ApiError(400, "All fields are required."));
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
      // return res.status(404).json({ error: "Inventory not found" });
      return next(new ApiError(404, "Inventory not found."));
    }

    // return res.status(200).json(updateInventory);
    let response = new ApiResponse(200, updateInventory);
    return res.json(response);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error Updating Inventory." });
    return next(
      new ApiError(500, error?.message || "Error Updating Inventory Details.")
    );
  }
};

exports.getInventoryById = async (req, res, next) => {
  try {
    let inventoryId = req.params.id;
    const result = await Inventory.findById(inventoryId);
    if (!result) {
      // return res.status(404).json({ error: "Inventory not found." });
      return next(new ApiError(404, "Inventory not found."));
    }
    // return res.status(200).json(result);
    let response = new ApiResponse(200, result);
    return res.json(response);
  } catch (error) {
    console.log(error);
    // return res.status(500).json({ error: "Internal server error" });
    return next(
      new ApiError(500, error?.message || "Error Getting Inventory Details.")
    );
  }
};
