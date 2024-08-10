const express = require("express");
const serviceController = require("../../controller/serviceController");
const upload = require("../../middleware/upload");

const router = express.Router();

//Add new service to database
router.post("/", serviceController.createService);

//get all services details from database
router.get("/", serviceController.getService);

//Update service by id
router.put("/:id", serviceController.updateService);

//route for service file upload
router.post("/serviceImg", upload.single("file"), serviceController.serviceImg);

router.get("/subService", serviceController.getSubService);

//Get service details by id
router.get("/:id", serviceController.getServiceById);


module.exports = router;
