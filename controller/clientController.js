const Client = require("../models/clients");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const s3 = new S3Client({
  region: process.env.AWSREGION,
  credentials: {
    accessKeyId: process.env.AWSACCESSKEYID,
    secretAccessKey: process.env.AWSSECRETKEY,
  },
});

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
      clientImg
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
      clientImg
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

exports.uploadClientProfile = async (req, res, next) => {
  try {
    if (req.file && req.file.buffer) {
      const uniqueSuffix = `${Date.now()}-${crypto
        .randomBytes(6)
        .toString("hex")}`;
      const extension = req.file.originalname.split(".").pop();
      const fileName = `${uniqueSuffix}.${extension}`;

      const params = {
        Bucket: process.env.AWSBUCKETNAME,
        Key: `images/${fileName}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);
      let response = new ApiResponse(201, fileName);
      return res.json(response);
    } else {
      let response = new ApiResponse(200, null);
      return res.json(response);
    }
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err?.message || "Error uploading image."));
  }
};
