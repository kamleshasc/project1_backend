const express = require("express");
const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");
const reportController = require("../../controller/reportController");

router.get("/sales", verifyJWT, reportController.getSalesReport);
router.get("/pdf/saleReport", verifyJWT, reportController.getSalesReportPDF);
router.get("/pdf/download/saleReport", verifyJWT, reportController.getSalesReportDownloadPdf);

module.exports = router;
