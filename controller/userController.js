const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");
const bcrypt = require("bcrypt");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");
const s3 = new S3Client({
  region: process.env.AWSREGION,
  credentials: {
    accessKeyId: process.env.AWSACCESSKEYID,
    secretAccessKey: process.env.AWSSECRETKEY,
  },
});

exports.createAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, password, email } = req.body;
    if (!firstName || !lastName || !password || !email) {
      return next(new ApiError(400, "All fields are required."));
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(new ApiError(400, "Email already exists."));
    }

    const newAdmin = new User({
      firstName,
      lastName,
      email,
      password,
      userType: "admin",
      status: "Active",
      isAdmin: true,
    });

    await newAdmin.save();
    if (newAdmin) {
      let response = new ApiResponse(201, newAdmin);
      return res.json(response);
    }
    return next(new ApiError(400, "Error while creating user."));
  } catch (error) {
    return next(new ApiError(500, error?.message || "Error creating admin."));
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "Email & Password is required."));
    }

    const result = await User.findOne({ email });
    if (result) {
      return next(new ApiError(400, "Email already found."));
    }

    const newCustomer = new User({
      ...req.body,
      userType: "customer",
    });
    await newCustomer.save();
    if (newCustomer) {
      return res.json(new ApiResponse(201, newCustomer));
    }
    return next(new ApiError(400, "Error while creating user."));
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error creating customer.")
    );
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    let id = req.params.id;
    let {
      firstName,
      lastName,
      dateOfjoining,
      status,
      mobileNumber,
      userImage,
    } = req.body;

    if (
      firstName &&
      lastName &&
      dateOfjoining &&
      status &&
      mobileNumber &&
      userImage
    ) {
      const findCustomer = await User.findOne({ _id: id });
      if (!findCustomer) {
        return next(new ApiError(404, "Customer not found."));
      }
      const updatedResult = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.json(new ApiResponse(200, updatedResult));
    }
    return next(
      new ApiError(400, "Other fields of customer can't be updated.")
    );
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error updating customer.")
    );
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const result = await User.find({ isAdmin: false, userType: "customer" });
    return res.json(new ApiResponse(200, result));
  } catch (error) {
    return next(new ApiError(500, error?.message || "Error getting cutomer."));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return next(new ApiError(400, "Email already exists."));
    }
    const newUser = new User(req.body);
    await newUser.save();
    if (newUser) {
      return res.json(new ApiResponse(201, newUser));
    }
  } catch (err) {
    console.error(err);
    // return res.status(500).json({ error: "Error saving user" });
    return next(new ApiError(500, err?.message || "Error creating users."));
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const users = await User.find({ isAdmin: false, userType: "employee" });
    let response = new ApiResponse(200, users);
    return res.json(response);
  } catch (err) {
    console.error(err);
    // logger.error("Error getting Users", err);
    return next(new ApiError(500, err?.message || "Error getting users"));
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    let userId = req.params.id;
    const result = await User.findById(userId);
    if (!result) {
      return next(new ApiError(404, "user not found."));
    }
    let response = new ApiResponse(200, result);
    return res.json(response);
  } catch (error) {
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
      return next(new ApiError(404, "User not found."));
    }
    let response = new ApiResponse(200, updateUser);
    return res.json(response);
  } catch (error) {
    console.error("Error updating user:", error);
    return next(new ApiError(500, error?.message || "Error updating users."));
  }
};

// exports.uploadUserProfile = async (req, res, next) => {
//   try {
//     if (req.file && req.file.filename) {
//       let response = new ApiResponse(201, req.file.filename);
//       return res.json(response);
//       // return res.status(201).json({ fileName: req.file.filename });
//     } else {
//       // return res.status(200).json({ fileName: null });
//       let response = new ApiResponse(201, null);
//       return res.json(response);
//     }
//   } catch (err) {
//     console.error(err);
//     // return res.status(500).json({ error: err });
//     return next(new ApiError(500, err?.message || "Error uploading profile."));
//   }
// };

exports.uploadUserProfile = async (req, res, next) => {
  try {
    if (req.file && req.file.buffer) {
      const uniqueSuffix = `${Date.now()}-${crypto
        .randomBytes(6)
        .toString("hex")}`;
      const extension = req.file.originalname.split(".").pop();
      const fileName = `${uniqueSuffix}.${extension}`;

      const params = {
        Bucket: process.env.AWSBUCKETNAME, // Replace with your bucket name
        Key: `images/${fileName}`, // Folder and file name in S3
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        // ACL: "public-read", // Adjust permissions as necessary
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
    return next(new ApiError(500, err?.message || "Error uploading profile."));
  }
};
