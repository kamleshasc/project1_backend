const express = require("express");
const Services = require("../../database/models/services");
const upload = require("../../middleware/upload");

const router = express.Router();

//Add new service to database
router.post("/newservice", async (req, res) => {
  try {
    const newService = new Services({
      serviceName: req.body.serviceName,
      duration: req.body.duration,
      category: req.body.category,
      price: req.body.price,
      onsiteOffsite: req.body.onsiteOffsite,
      status: req.body.status,
      selectedBranches: req.body.selectedBranches,
      selectedUsers: req.body.selectedUsers,
      serviceImage: req.body.serviceImage,
      createdBy: req.body.createdBy,
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error Adding New Service" });
  }
});

//get all services details from database
router.get("/getAllservices", async (req, res) => {
  try {
    const getServices = await Services.find();
    // .populate("createdBy", {
    //   firstName: 1,
    //   lastName: 1,
    // });
    res.status(201).json(getServices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error getting Services record" });
  }
});

//to update the edited service
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
    res.status(201).json(updateService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error Updating the selected Service" });
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
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
