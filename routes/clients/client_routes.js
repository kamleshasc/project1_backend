const express = require("express");
const Client = require("../../database/models/clients");

const router = express.Router();

// Create new client
router.post("/addClient", async (req, res) => {
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
      return res.status(401).json({ error: "Client all fields are required!" });
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
    return res.status(201).json(newClient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error Adding New Client" });
  }
});

//Get new client from database
router.get("/getClients", async (req, res) => {
  try {
    const clients = await Client.find().populate("owner", {
      _id: 1,
      firstName: 1,
      lastName: 1,
    });
    return res.status(200).json(clients);
  } catch (error) {
    console.error(err);
    return res.status(500).json({ error: "Error Getting Client" });
  }
});

//Update client by id
router.put("/:id", async (req, res) => {
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
      return res.status(401).json({ error: "Client all fields are required!" });
    }
    const clientId = req.params.id;
    const updateData = req.body;
    const updateClient = await Client.findByIdAndUpdate(clientId, updateData, {
      new: true,
    });

    if (!updateClient) {
      console.log("Client not found !!");
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(updateClient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error Updating Client" });
  }
});

//Get single client by id
router.get("/getClientById/:id", async (req, res) => {
  try {
    let clientId = req.params.id;
    const result = await Client.findById(clientId);
    if (!result) {
      return res.status(404).json({ error: "Client not found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
