const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");
const bcrypt = require("bcrypt");

exports.createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    if (!firstName || !lastName || !password || !email) {
      // return res.status(400).json({ error: "All fields are required!" });
      return next(new ApiError(400, "All fields are required."));
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      // return res.status(400).json({ error: "Email already exists." });
      return next(new ApiError(400, "Email already exists."));
    }

    const newAdmin = new User({
      firstName,
      lastName,
      email,
      password,
      userType: "admin",
      isAdmin: true,
    });

    await newAdmin.save();
    let response = new ApiResponse(201, newAdmin);
    return res.json(response);
    // return res.status(201).json(newAdmin);
  } catch (error) {
    console.log(error, "error");
    // return res.status(500).json({ error: "Error saving user" });
    return next(new ApiError(500, error?.message || "Error creating admin."));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      // return res.status(400).json({ error: "Email already exists." });
      return next(new ApiError(400, "Email already exists."));
    }
    const newUser = new User(req.body);
    await newUser.save();
    let response = new ApiResponse(201, newUser);
    return res.json(response);
    // return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    // return res.status(500).json({ error: "Error saving user" });
    return next(new ApiError(500, err?.message || "Error creating users."));
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false });
    let response = new ApiResponse(200, users);
    return res.json(response);
    // return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    // logger.error("Error getting Users", err);
    // return res.status(500).json({ error: "Error getting users" });
    return next(new ApiError(500, err?.message || "Error getting users"));
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const result = await User.findById(userId);
    if (!result) {
      // return res.status(404).json({ error: "user not found." });
      return next(new ApiError(404, "user not found."));
    }
    let response = new ApiResponse(200, result);
    return res.json(response);
    // return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    // return res.status(500).json({ error: "Internal server error" });
    return next(new ApiError(500, error?.message || "Error getting users"));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    if (req?.body?.password) {
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashPassword;
    }

    const updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updateUser) {
      // return res.status(404).json({ error: "User not found" });
      return next(new ApiError(404, "User not found."));
    }
    let response = new ApiResponse(200, updateUser);
    return res.json(response);
    // return res.status(200).json(updateUser);
  } catch (error) {
    console.error("Error updating user:", error);
    // return res.status(500).json({ error: err?.message || "Error updating user." });
    return next(new ApiError(500, error?.message || "Error updating users."));
  }
};

exports.uploadUserProfile = async (req, res, next) => {
  try {
    if (req.file && req.file.filename) {
      let response = new ApiResponse(201, req.file.filename);
      return res.json(response);
      // return res.status(201).json({ fileName: req.file.filename });
    } else {
      // return res.status(200).json({ fileName: null });
      let response = new ApiResponse(201, null);
      return res.json(response);
    }
  } catch (err) {
    console.error(err);
    // return res.status(500).json({ error: err });
    return next(new ApiError(500, err?.message || "Error uploading profile."));
  }
};
