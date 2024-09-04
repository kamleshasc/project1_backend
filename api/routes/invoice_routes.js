const express = require("express");
const invoiceController = require("../../controller/invoiceController");

const router = express.Router();
const verifyJWT = require("../../middleware/verifyJWT");

// Create new Invoice to database
router.post("/", verifyJWT, invoiceController.createInvoice);

//Get all invoices
router.get("/", verifyJWT, invoiceController.getInvoice);

//Get invoice by id
router.get("/:id", verifyJWT, invoiceController.getInvoiceById);

//Update invoice by id
router.put("/:id", verifyJWT, invoiceController.updateInvoice);

//Get base64 pdf of invoice
router.get("/pdf/:id", verifyJWT, invoiceController.getPdfById);

//Get Pdf by invoice id
router.get("/pdf/download/:id", invoiceController.getPdfDownloadById);

module.exports = router;
