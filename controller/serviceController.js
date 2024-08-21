const Services = require("../models/services");
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

exports.createService = async (req, res, next) => {
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
    // return res.status(201).json(newService);
    let response = new ApiResponse(201, newService);
    return res.json(response);
  } catch (err) {
    // return res.status(500).json({ error: "Error Adding New Service" });
    return next(
      new ApiError(500, err?.message || "Error Create Service Details.")
    );
  }
};

exports.getService = async (req, res, next) => {
  try {
    const getServices = await Services.find().populate("selectedUsers", {
      _id: 1,
      firstName: 1,
      lastName: 1,
    });
    // return res.status(201).json(getServices);
    let response = new ApiResponse(200, getServices);
    return res.json(response);
  } catch (err) {
    // return res.status(500).json({ error: "Error getting Services record" });
    return next(
      new ApiError(500, err?.message || "Error Get Service  Details.")
    );
  }
};

exports.updateService = async (req, res, next) => {
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
      // return res
      //   .status(404)
      //   .json({ error: "Service not found and so, can't updated" });
      return next(new ApiError(404, err?.message || "Service not found."));
    }
    let response = new ApiResponse(200, updateService);
    return res.json(response);
    // return res.status(201).json(updateService);
  } catch (err) {
    // return res
    //   .status(500)
    //   .json({ error: "Error Updating the selected Service" });
    return next(
      new ApiError(500, err?.message || "Error updating sevice.")
    );
  }
};

// exports.serviceImg = async (req, res, next) => {
//   try {
//     if (req.file && req.file.filename) {
//       // return res.status(201).json({ fileName: req.file.filename });
//       let response = new ApiResponse(200, req.file.filename);
//       return res.json(response);
//     } else {
//       // return res.status(200).json({ fileName: null });
//       let response = new ApiResponse(200, null);
//       return res.json(response);
//     }
//   } catch (err) {
//     // return res.status(500).json({ error: err });
//     return next(
//       new ApiError(500, err?.message || "Error uploading service image.")
//     );
//   }
// };

exports.serviceImg = async (req, res, next) => {
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

exports.getServiceById = async (req, res, next) => {
  try {
    let serviceId = req.params.id;
    const result = await Services.findById(serviceId);
    if (!result) {
      // return res.status(404).json({ error: "Service not found." });
      return next(new ApiError(404, "Service not found."));
    }
    // return res.status(200).json(result);
    let response = new ApiResponse(200, result);
    return res.json(response);
  } catch (error) {
    // return res.status(500).json({ error: "Internal server error" });
    return next(
      new ApiError(500, error?.message || "Error Getting Service Details.")
    );
  }
};

exports.getSubService = async (req, res, next) => {
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
      // return res.status(200).json(final);
      let response = new ApiResponse(200, final);
      return res.json(response);
    }
    // return res.status(200).json(result);
    let response = new ApiResponse(200, result);
    return res.json(response);
  } catch (error) {
    // return res.status(500).json({ error: "Internal server error" });
    return next(
      new ApiError(500, error?.message || "Error Getting SubServices.")
    );
  }
};
