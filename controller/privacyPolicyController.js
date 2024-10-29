const PrivacyPolicy = require("../models/privacyPolicy");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");

exports.createPrivacyPolicy = async (req, res, next) => {
  try {
    const user_details = req.user;
    if (user_details.userType == "admin") {
      const newPrivacyPolicy = new PrivacyPolicy(req.body);
      const result = await newPrivacyPolicy.save();
      if (result) {
        return res.json(new ApiResponse(201, result));
      }
      return next(new ApiError(400, "Error while creating Privacy Policy."));
    }
    return next(new ApiError(400, "Only admin can create Privacy Policy."));
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error Creating Privacy Policy.")
    );
  }
};

exports.getPrivacyPolicy = async (req, res, next) => {
  try {
    const getPrivacyPolicy = await PrivacyPolicy.find();
    if (getPrivacyPolicy) {
      return res.json(new ApiResponse(200, getPrivacyPolicy));
    }
    return next(new ApiError(400, "Error while getting Privacy Policy."));
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error Getting Privacy Policy.")
    );
  }
};

exports.updatePrivacyPolicy = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const data = req.body;
    const user_details = req.user;
    if (user_details.userType == "admin") {
      const updatePrivacyPolicy = await PrivacyPolicy.findByIdAndUpdate(
        Id,
        data,
        { new: true }
      );
      if (updatePrivacyPolicy) {
        return res.json(new ApiResponse(200, updatePrivacyPolicy));
      }
      return next(new ApiError(400, "Error while updating Privacy Policy."));
    }
    return next(new ApiError(400, "Only admin can update Privacy Policy."));
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error Updating Privacy Policy.")
    );
  }
};

exports.deletePrivacyPolicy = async (req, res, next) => {
  try {
    const Id = req.params.id;
    const user_details = req.user;
    if (user_details.userType == "admin") {
      const deletePrivacyPolicy = await PrivacyPolicy.findByIdAndDelete(Id);
      if (deletePrivacyPolicy) {
        return res.json(new ApiResponse(200, deletePrivacyPolicy));
      }
      return next(new ApiError(400, "Error while deleting Privacy Policy."));
    }
    return next(new ApiError(400, "Only admin can delete Privacy Policy."));
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error Delete Privacy Policy.")
    );
  }
};
