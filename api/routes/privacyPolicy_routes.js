const express = require("express");
const privacyPolicyController = require("../../controller/privacyPolicyController");
const verifyJWT = require("../../middleware/verifyJWT");

const router = express.Router();

router.post("/", verifyJWT, privacyPolicyController.createPrivacyPolicy);
router.get("/", privacyPolicyController.getPrivacyPolicy);
router.put("/:id", verifyJWT, privacyPolicyController.updatePrivacyPolicy);
router.delete("/:id", verifyJWT, privacyPolicyController.deletePrivacyPolicy);

module.exports = router;
