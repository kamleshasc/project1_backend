const express = require("express");
const serviceController = require("../../controller/serviceController");
const upload = require("../../middleware/upload");
const verifyJWT = require("../../middleware/verifyJWT");

const router = express.Router();

//Add new service to database
router.post("/", verifyJWT, serviceController.createService);

//get all services details from database
router.get("/", verifyJWT, serviceController.getService);

//Update service by id
router.put("/:id", verifyJWT, serviceController.updateService);

//route for service file upload
router.post(
  "/serviceImg",
  verifyJWT,
  upload.single("file"),
  serviceController.serviceImg
);

router.get("/subService", verifyJWT, serviceController.getSubService);

//Get service details by id
router.get("/:id", verifyJWT, serviceController.getServiceById);

module.exports = router;
