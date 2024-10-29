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

router.get(
  "/getUserByCategory/:name",
  verifyJWT,
  serviceController.getUserByCategory
);
//Get service details by id
router.get("/:id", verifyJWT, serviceController.getServiceById);
router.get("/expert/all", verifyJWT, serviceController.getExpertService);
router.get(
  "/expert/:expertId",
  verifyJWT,
  serviceController.getSubServiceByExpert
);
router.get(
  "/assignedService/:serviceId",
  verifyJWT,
  serviceController.getAssignedServiceEmployee
);

router.get("/country/getcountrybytime", serviceController.getCountryByTime);

module.exports = router;
