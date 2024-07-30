const express = require("express");
const Invoice = require("../../database/models/invoice");
const PdfPrinter = require("pdfmake");
const path = require("path");
const {
  DateFormateMMMMDDYYY,
} = require("../../config/helper");

const router = express.Router();

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../../fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../../fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "../../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../../fonts/Roboto-MediumItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

// Create new Invoice to database
router.post("/", async (req, res) => {
  try {
    let {
      client,
      employee,
      branch,
      selectedService,
      dateOfInvoice,
      invoiceNumber,
      total,
      taxValue,
      taxPercentage,
      finalTotal,
    } = req.body;

    if (
      !client ||
      !employee ||
      !branch ||
      !selectedService ||
      !dateOfInvoice ||
      !invoiceNumber ||
      !total ||
      !taxValue ||
      !taxPercentage ||
      !finalTotal
    ) {
      return res
        .status(401)
        .json({ error: "Invoice all fields are required." });
    }

    const invoice = new Invoice({
      client,
      employee,
      branch,
      selectedService,
      dateOfInvoice,
      invoiceNumber,
      total,
      taxValue,
      taxPercentage,
      finalTotal,
    });
    const result = await invoice.save();
    return res.status(201).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error Adding Invoice." });
  }
});

//Get all invoices
router.get("/", async (req, res, next) => {
  try {
    const result = await Invoice.find()
      .populate("client", { firstName: 1, lastName: 1 })
      .populate("employee", { firstName: 1, lastName: 1 });
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error getting invoice." });
  }
});

//Get invoice by id
router.get("/:id", async (req, res) => {
  try {
    let invoiceId = req.params.id;
    const result = await Invoice.findById(invoiceId)
      .populate("client", { firstName: 1, lastName: 1 })
      .populate("employee", { firstName: 1, lastName: 1 });

    if (!result) {
      return res.status(404).json({ error: "Invoice not found." });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: "Error get invoice." });
  }
});

//Update invoice by id
router.put("/:id", async (req, res) => {
  try {
    let invoiceId = req.params.id;
    let {
      client,
      employee,
      branch,
      selectedService,
      dateOfInvoice,
      invoiceNumber,
      total,
      taxValue,
      taxPercentage,
      finalTotal,
    } = req.body;
    if (
      !client ||
      !employee ||
      !branch ||
      !selectedService ||
      !dateOfInvoice ||
      !invoiceNumber ||
      !total ||
      !taxValue ||
      !taxPercentage ||
      !finalTotal
    ) {
      return res
        .status(401)
        .json({ error: "Invoice all fields are required." });
    }
    const invoiceBody = req.body;
    const result = await Invoice.findByIdAndUpdate(invoiceId, invoiceBody);
    if (!result) {
      return res.status(404).json({ error: "Invoice id not found." });
    }
    return res.status(202).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error Updating Invoice." });
  }
});

//Get base64 pdf of invoice
router.get("/pdf/:id", async (req, res) => {
  try {
    const result = await Invoice.findById(req.params.id)
      .populate("client", {
        firstName: 1,
        lastName: 1,
        email: 1,
        prefix: 1,
        mobileNumber: 1,
      })
      .populate("employee", {
        firstName: 1,
        lastName: 1,
        email: 1,
        mobileNumber: 1,
      });

    if (!result) {
      return res.status(404).json({ error: "Service id not found." });
    }

    generateInvoice(result, (pdfBuffer) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(pdfBuffer.toString("base64"));
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting invoice" });
  }
});

//Get Pdf by invoice id
router.get("/pdf/download/:id", async (req, res) => {
  try {
    const result = await Invoice.findById(req.params.id)
      .populate("client", {
        firstName: 1,
        lastName: 1,
        email: 1,
        prefix: 1,
        mobileNumber: 1,
      })
      .populate("employee", {
        firstName: 1,
        lastName: 1,
        email: 1,
        mobileNumber: 1,
      });

    if (!result) {
      return res.status(404).json({ error: "Service id not found." });
    }

    generateInvoice(result, (pdfBuffer) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
      res.status(200).send(pdfBuffer);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error while downloading" });
  }
});

//This function use for generate invoice pdf
function generateInvoice(invoiceDetails, callback) {
  const {
    client,
    employee,
    branch,
    selectedService,
    dateOfInvoice,
    invoiceNumber,
    total,
    taxPercentage,
    taxValue,
    finalTotal,
  } = invoiceDetails;

  const docDefinition = {
    header: { text: "Invoice", style: "header" },
    content: [
      {
        columns: [
          {
            image: "fonts/Company_Logo.png",
            fit: [150, 150],
            width: "70%",
            alignment: "left",
            margin: [0, 20, 20, 20],
          },
          {
            text: `Invoice Number: ${invoiceNumber}\nInvoice Date: ${DateFormateMMMMDDYYY(
              dateOfInvoice
            )}`,
            width: "30%",
            bold: true,
            margin: [0, 30, 0, 20],
            alignment: "left",
          },
        ],
      },
      {
        columns: [
          {
            text: `Company Details:`,
            width: "50%",
            bold: true,
            margin: [0, 20, 20, 5],
          },
          {
            text: `Customer Details:`,
            width: "50%",
            bold: true,
            margin: [10, 20, 20, 5],
          },
        ],
      },
      {
        columns: [
          {
            text: `Name:  ${employee.firstName} ${employee.lastName}\n Branch: ${branch}\nPhone: ${employee.mobileNumber}\nEmail: ${employee.email}`,
            width: "50%",
            margin: [0, 0, 20, 10],
          },
          {
            text: `Name: ${client.prefix} ${client.firstName} ${client.lastName}\nPhone: ${client.mobileNumber}\nEmail: ${client.email}`,
            width: "50%",
            margin: [10, 0, 0, 10],
          },
        ],
      },
      "\n",
      {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "15%", "15%"],
          body: [
            [
              { text: "No", style: "tableHeader", margin: [0, 4, 0, 4] },
              {
                text: "Service",
                style: "tableHeader",
                alignment: "center",
                margin: [0, 4, 0, 4],
              },
              {
                text: "Duration",
                style: "tableHeader",
                margin: [0, 4, 0, 4],
                alignment: "center",
              },
              {
                text: "Amount",
                style: "tableHeader",
                margin: [0, 4, 0, 4],
                alignment: "center",
              },
            ],
            ...selectedService.map((item, index) => [
              { text: index + 1, alignment: "center" },
              { text: item.name },
              { text: item.duration, alignment: "center" },
              {
                text: `$${item.price.toFixed(2)}`,
                alignment: "right",
                margin: [0, 0, 4, 0],
              },
            ]),
          ],
        },
      },
      "\n",
      {
        table: {
          widths: ["*", "40%"],
          body: [
            [
              { text: "Subtotal", alignment: "left", fontSize: 12 },
              { text: `$${total}`, alignment: "center" },
            ],
            [
              {
                text: `Tax @${taxPercentage}%`,
                alignment: "left",
                fontSize: 12,
              },
              { text: `$${taxValue}`, alignment: "center" },
            ],
            [
              { text: "Total", bold: true, alignment: "left", fontSize: 13 },
              { text: `$${finalTotal}`, alignment: "center" },
            ],
          ],
        },
      },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        marginTop: 5,
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];

  pdfDoc.on("data", (chunk) => chunks.push(chunk));
  pdfDoc.on("end", () => callback(Buffer.concat(chunks)));
  pdfDoc.end();
}

module.exports = router;
