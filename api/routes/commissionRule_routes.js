const express = require("express");
const commissionRuleController = require("../../controller/commissionRuleController");

const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

//Create new commission rule
router.post("/", verifyJWT, commissionRuleController.createCommissionRule);

//Get all commission rule from database
router.get("/", verifyJWT, commissionRuleController.getCommissionRule);

//Update commission rule by id
router.put("/:id", verifyJWT, commissionRuleController.updateCommissionRule);

//Get commission by id
router.get("/:id", verifyJWT, commissionRuleController.getCommissionRuleById);

module.exports = router;
