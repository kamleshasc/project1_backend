const express = require("express");
const base64 = require("base64-js");
const fs = require("fs");

const User = require("../../database/models/user");
const upload = require("../../middleware/upload");
// const logger = require('../../utils/logger'); // Optional logger

const router = express.Router();

//create new user to the database
router.post("/newuser", async (req, res) => {
  try {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      title: req.body.title,
      role: req.body.role,
      dateOfjoining: req.body.dateOfjoining,
      status: req.body.status,
      mobileNumber: req.body.mobileNumber,
      userImage: req.body.userImage,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error saving user" });
  }
});

//get the user's data from the database
router.get("/getuser", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    // logger.error("Error getting Users", err);
    return res.status(500).json({ error: "Error getting users" });
  }
});

//route for handling Update request
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    const updateUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updateUser) {
      console.log("User not found !!");
      return res.status(404).json({ error: "User not found" });
    }
    //send updated user as a response
    return res.status(200).json(updateUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//route for user's file upload
router.post("/uploadImg", upload.single("file"), async (req, res) => {
  try {
    if (req.file && req.file.filename) {
      return res.status(201).json({ fileName: req.file.filename });
    } else {
      return res.status(200).json({ fileName: null });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});

//route for get user details by id
router.get("/getUserById/:id", async (req, res) => {
  try {
    let userId = req.params.id;
    const result = await User.findById(userId);
    if (!result) {
      return res.status(404).json({ error: "user not found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
