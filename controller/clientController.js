const Client = require("../models/clients");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");

exports.createClient = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      addressLineOne,
      addressLineTwo,
      country,
      state,
      city,
      prefix,
      owner,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !email ||
      !addressLineOne ||
      !addressLineTwo ||
      !country ||
      !state ||
      !city ||
      !owner ||
      !prefix
    ) {
      // return res.status(401).json({ error: "Client all fields are required!" });
      return next(new ApiError(401, "Client all fields are required!"));
    }

    const newClient = new Client({
      firstName,
      lastName,
      mobileNumber,
      email,
      addressLineOne,
      addressLineTwo,
      country,
      state,
      city,
      prefix,
      owner,
    });
    await newClient.save();
    let response = new ApiResponse(201, newClient);
    return res.json(response);
    // return res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error Adding New Client" });
    return next(new ApiError(500, error?.message || "Error create client."));
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      mobileNumber,
      email,
      addressLineOne,
      addressLineTwo,
      country,
      state,
      city,
      owner,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !mobileNumber ||
      !email ||
      !addressLineOne ||
      !addressLineTwo ||
      !country ||
      !state ||
      !city ||
      !owner
    ) {
      // return res.status(401).json({ error: "Client all fields are required!" });
      return next(new ApiError(401, "Client all fields are required!"));
    }
    const clientId = req.params.id;
    const updateData = req.body;
    const updateClient = await Client.findByIdAndUpdate(clientId, updateData, {
      new: true,
    });

    if (!updateClient) {
      // return res.status(404).json({ error: "Client not found" });
      return next(new ApiError(404, "Client not found."));
    }
    let response = new ApiResponse(200, updateClient);
    return res.json(response);
    // return res.status(200).json(updateClient);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error Updating Client" });
    return next(new ApiError(500, error?.message || "Error updating client."));
  }
};

exports.getClient = async (req, res, next) => {
  try {
    const clients = await Client.find().populate("owner", {
      _id: 1,
      firstName: 1,
      lastName: 1,
    });
    // return res.status(200).json(clients);
    let response = new ApiResponse(200, clients);
    return res.json(response);
  } catch (error) {
    console.error(err);
    // return res.status(500).json({ error: "Error Getting Client" });
    return next(new ApiError(500, error?.message || "Error getting client."));
  }
};

exports.getClientById = async (req, res, next) => {
  try {
    let clientId = req.params.id;
    const result = await Client.findById(clientId);
    if (!result) {
      // return res.status(404).json({ error: "Client not found." });
      return next(new ApiError(404, "Client not found."));
    }
    // return res.status(200).json(result);
    let response = new ApiResponse(200, result);
    return res.json(response);
  } catch (error) {
    console.log(error);
    // return res.status(500).json({ error: "Internal server error" });
    return next(new ApiError(500, error?.message || "Error getting client."));
  }
};
