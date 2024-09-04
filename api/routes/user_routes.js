const express = require("express");

const userController = require("../../controller/userController");
const upload = require("../../middleware/upload");
const verifyJWT = require("../../middleware/verifyJWT");
// const logger = require('../../utils/logger'); // Optional logger

const router = express.Router();

//create admin
router.post("/admin", userController.createAdmin);

//create new user to the database
router.post("/", userController.createUser);

//get the user's data from the database
router.get("/", verifyJWT, userController.getUser);

//route for handling Update request
router.put("/:id", verifyJWT,userController.updateUser);

//route for user's file upload
router.post(
  "/uploadImg",
  upload.single("file"),
  userController.uploadUserProfile
);

router.get("/customer", verifyJWT,userController.getCustomer);
//route for get user details by id
router.get("/:id", verifyJWT,userController.getUserById);
//route for create customer
router.post("/customer", userController.createCustomer);
router.put("/customer/:id", verifyJWT,userController.updateCustomer);

module.exports = router;
