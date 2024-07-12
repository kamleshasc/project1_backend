const express = require("express");
const CommissionRule = require("../../database/models/commissionRules");

const router = express.Router();

//Create new commission rule
router.post("/", async (req, res) => {
  try {
    const { name, criteria, value, applicableUser, createdBy } = req.body;
    if (!name || !criteria || !value || !applicableUser || !createdBy) {
      return res
        .status(401)
        .json({ error: "Commission Rules all fields are required." });
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
    return res.status(201).json(newCommission);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error Adding New Commission Rule." });
  }
});

//Get all commission rule from database
router.get("/", async (req, res) => {
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

    return res.status(200).json(getCommissionRules);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting Commission Rule." });
  }
});

//Update commission rule by id
router.put("/:id", async (req, res) => {
  try {
    const { name, criteria, value, applicableUser, updatedBy } = req.body;
    if (!name || !criteria || !value || !applicableUser || !updatedBy) {
      return res.status(422).json("Commission Rules all fields are required.");
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
      return res.status(404).json({ error: "Commission Rule not found" });
    }

    return res.status(200).json({ updateCommissinRule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error Updating Commission Rule." });
  }
});

//Get commission by id
router.get("/:id", async (req, res) => {
  try {
    let commissionId = req.params.id;
    const result = await CommissionRule.findById(commissionId);
    if (!result) {
      return res.status(404).json({ error: "Commission rule not found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
