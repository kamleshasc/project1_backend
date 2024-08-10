const express = require("express");
const invoiceController = require("../../controller/invoiceController");

const router = express.Router();

// Create new Invoice to database
router.post("/", invoiceController.createInvoice);

//Get all invoices
router.get("/", invoiceController.getInvoice);

//Get invoice by id
router.get("/:id", invoiceController.getInvoiceById);

//Update invoice by id
router.put("/:id", invoiceController.updateInvoice);

//Get base64 pdf of invoice
router.get("/pdf/:id", invoiceController.getPdfById);

//Get Pdf by invoice id
router.get("/pdf/download/:id", invoiceController.getPdfDownloadById);

module.exports = router;
