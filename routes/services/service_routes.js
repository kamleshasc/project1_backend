const express = require("express");
const Services = require("../../database/models/services");
const upload = require("../../middleware/upload");

const router = express.Router();

//Add new service to database
router.post("/newservice", async (req, res) => {
  try {
    const newService = new Services({
      serviceName: req.body.serviceName,
      category: req.body.category,
      onsiteOffsite: req.body.onsiteOffsite,
      status: req.body.status,
      selectedBranches: req.body.selectedBranches,
      selectedUsers: req.body.selectedUsers,
      serviceImage: req.body.serviceImage,
      subService: req.body.subService,
      createdBy: req.body.createdBy,
    });
    await newService.save();
    return res.status(201).json(newService);
  } catch (err) {
    return res.status(500).json({ error: "Error Adding New Service" });
  }
});

//get all services details from database
router.get("/getAllservices", async (req, res) => {
  try {
    const getServices = await Services.find().populate("selectedUsers", {
      _id: 1,
      firstName: 1,
      lastName: 1,
    });
    return res.status(201).json(getServices);
  } catch (err) {
    return res.status(500).json({ error: "Error getting Services record" });
  }
});

//Update service by id
router.put("/:id", async (req, res) => {
  const serviceId = req.params.id;
  const updatedData = req.body;

  try {
    const updateService = await Services.findByIdAndUpdate(
      serviceId,
      updatedData,
      {
        new: true,
      }
    );

    if (!updateService) {
      console.log("Service not found and can't updated");
      return res
        .status(404)
        .json({ error: "Service not found and so, can't updated" });
    }
    return res.status(201).json(updateService);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error Updating the selected Service" });
  }
});

//route for service file upload
router.post("/serviceImg", upload.single("file"), async (req, res) => {
  try {
    if (req.file && req.file.filename) {
      return res.status(201).json({ fileName: req.file.filename });
    } else {
      return res.status(200).json({ fileName: null });
    }
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

//Get service details by id
router.get("/getServiceById/:id", async (req, res) => {
  try {
    let serviceId = req.params.id;
    const result = await Services.findById(serviceId);
    if (!result) {
      return res.status(404).json({ error: "Service not found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/subService", async (req, res) => {
  try {
    const result = await Services.find({}, { _id: 1, subService: 1 });
    if (result && result.length > 0) {
      let final = [];
      for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].subService.length; j++) {
          let body = {
            parentId: result[i]._id,
            name: result[i].subService[j].name,
            id: result[i].subService[j].id,
            duration: result[i].subService[j].duration,
            price: result[i].subService[j].price,
          };
          final.push(body);
        }
      }
      return res.status(200).json(final);
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
