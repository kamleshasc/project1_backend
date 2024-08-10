const express = require("express");

const userController = require("../../controller/userController");
const upload = require("../../middleware/upload");
// const logger = require('../../utils/logger'); // Optional logger

const router = express.Router();

//create admin
router.post("/admin", userController.createAdmin);

//create new user to the database
router.post("/", userController.createUser);

//get the user's data from the database
router.get("/", userController.getUser);

//route for handling Update request
router.put("/:id", userController.updateUser);

//route for user's file upload
router.post(
  "/uploadImg",
  upload.single("file"),
  userController.uploadUserProfile
);

//route for get user details by id
router.get("/:id", userController.getUserById);
module.exports = router;
