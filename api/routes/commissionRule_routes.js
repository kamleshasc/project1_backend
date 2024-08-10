const express = require("express");
const commissionRuleController = require("../../controller/commissionRuleController");

const router = express.Router();

//Create new commission rule
router.post("/", commissionRuleController.createCommissionRule);

//Get all commission rule from database
router.get("/", commissionRuleController.getCommissionRule);

//Update commission rule by id
router.put("/:id", commissionRuleController.updateCommissionRule);

//Get commission by id
router.get("/:id", commissionRuleController.getCommissionRuleById);

module.exports = router;
