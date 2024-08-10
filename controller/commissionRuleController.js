const CommissionRule = require("../models/commissionRules");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");

exports.createCommissionRule = async (req, res, next) => {
  try {
    const { name, criteria, value, applicableUser, createdBy } = req.body;
    if (!name || !criteria || !value || !applicableUser || !createdBy) {
      // return res
      //   .status(401)
      //   .json({ error: "Commission Rules all fields are required." });
      return next(
        new ApiError(400, "Commission Rules all fields are required.")
      );
    }
    const newCommission = new CommissionRule({
      name,
      criteria,
      value,
      applicableUser,
      createdBy,
      updatedBy: createdBy,
    });
    await newCommission.save();
    let response = new ApiResponse(200, newCommission);
    return res.json(response);
    // return res.status(201).json(newCommission);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error Adding New Commission Rule." });
    return next(
      new ApiError(500, error?.message || "Error Adding New Commission Rule.")
    );
  }
};

exports.getCommissionRule = async (req, res, next) => {
  try {
    const getCommissionRules = await CommissionRule.find()
      .populate("applicableUser", {
        _id: 1,
        firstName: 1,
        lastName: 1,
      })
      .populate("createdBy", {
        _id: 1,
        firstName: 1,
        lastName: 1,
      })
      .populate("updatedBy", {
        _id: 1,
        firstName: 1,
        lastName: 1,
      });

    let response = new ApiResponse(200, getCommissionRules);
    return res.json(response);
    // return res.status(200).json(getCommissionRules);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error getting Commission Rule." });
    return next(
      new ApiError(500, error?.message || "Error getting New Commission Rule.")
    );
  }
};

exports.updateCommissionRule = async (req, res, next) => {
  try {
    const { name, criteria, value, applicableUser, updatedBy } = req.body;
    if (!name || !criteria || !value || !applicableUser || !updatedBy) {
      // return res.status(422).json("Commission Rules all fields are required.");
      return next(
        new ApiError(400, "Commission Rules all fields are required.")
      );
    }
    const commissionRuleId = req.params.id;
    const updateBody = {
      name,
      criteria,
      value,
      applicableUser,
      updatedBy,
    };

    const updateCommissinRule = await CommissionRule.findByIdAndUpdate(
      commissionRuleId,
      updateBody,
      { new: true }
    );

    if (!updateCommissinRule) {
      // return res.status(404).json({ error: "Commission Rule not found" });
      return next(new ApiError(404, "Commission Rules not found."));
    }

    // return res.status(200).json({ updateCommissinRule });
    let response = new ApiResponse(200, updateCommissinRule);
    return res.json(response);
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error Updating Commission Rule." });
    return next(
      new ApiError(500, error?.message || "Error Updating New Commission Rule.")
    );
  }
};

exports.getCommissionRuleById = async (req, res, next) => {
  try {
    let commissionId = req.params.id;
    const result = await CommissionRule.findById(commissionId);
    if (!result) {
      // return res.status(404).json({ error: "Commission rule not found." });
      return next(new ApiError(404, "Commission Rules not found."));
    }
    // return res.status(200).json(result);
    let response = new ApiResponse(200, result);
    return res.json(response);
  } catch (error) {
    console.log(error);
    // return res.status(500).json({ error: "Internal server error" });
    return next(
      new ApiError(500, error?.message || "Error Getting New Commission Rule.")
    );
  }
};
