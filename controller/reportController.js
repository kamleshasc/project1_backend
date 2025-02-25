const Payment = require("../models/payment");
const ApiError = require("../utils/ApiError");
const Apiresponse = require("../utils/Apiresponse");
const PdfPrinter = require("pdfmake");
const path = require("path");
const fs = require("fs");

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../fonts/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../fonts/Roboto-MediumItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(new ApiError(400, "params are required."));
    }

    // Convert query dates to UTC and adjust end date to include full day
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const report = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: start,
            $lt: end,
          },
          paymentStatus: "completed",
        },
      },
      {
        $facet: {
          overAll: [
            {
              $group: {
                _id: "$paymentMethod",
                total: { $sum: "$total" },
              },
            },
            {
              $group: {
                _id: null,
                cash: {
                  $sum: { $cond: [{ $eq: ["$_id", "cash"] }, "$total", 0] },
                },
                zelle: {
                  $sum: { $cond: [{ $eq: ["$_id", "zelle"] }, "$total", 0] },
                },
                credit_card: {
                  $sum: {
                    $cond: [{ $eq: ["$_id", "credit_card"] }, "$total", 0],
                  },
                },
              },
            },
            { $project: { _id: 0 } },
          ],
          reportList: [
            {
              $addFields: {
                month: {
                  $dateToString: {
                    format: "%b %Y",
                    date: "$paymentDate",
                    timezone: "UTC",
                  },
                },
              },
            },
            {
              $group: {
                _id: "$month",
                monthList: {
                  $push: {
                    id: "$transactionId",
                    service: "$customerName",
                    price: "$total",
                    type: "$paymentMethod",
                  },
                },
                year: { $first: { $year: "$paymentDate" } },
                monthNumber: { $first: { $month: "$paymentDate" } },
              },
            },
            {
              $project: {
                _id: 0,
                month: "$_id",
                monthList: 1,
                year: 1,
                monthNumber: 1,
              },
            },
            { $sort: { year: 1, monthNumber: 1 } },
            { $project: { year: 0, monthNumber: 0 } },
          ],
        },
      },
      {
        $project: {
          overAll: { $arrayElemAt: ["$overAll", 0] },
          reportList: 1,
        },
      },
      {
        $match: {
          $or: [{ overAll: { $ne: null } }, { reportList: { $ne: [] } }],
        },
      },
    ]);

    if (report.length > 0) {
      return res.json(new Apiresponse(200, report));
    } else {
      return res.json(new Apiresponse(200, []));
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "An error occured while creating payment."
      )
    );
  }
};

exports.getSalesReportPDF = async (req, res, next) => {
  try {
    const { startDate, endDate, tType } = req.query;
    const listType = ["cash", "zelle", "credit_card", "all"];

    if (!startDate || !endDate || !tType) {
      return next(new ApiError(400, "params are required."));
    }

    let sc_type = tType.toLowerCase();
    if (!listType.includes(sc_type)) {
      sc_type = "all";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const report = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: start,
            $lt: end,
          },
          paymentStatus: "completed",
          ...(sc_type === "all" ? {} : { paymentMethod: sc_type }),
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "bookingIds",
          foreignField: "_id",
          as: "bookingDetails",
        },
      },
      { $unwind: "$bookingDetails" },
      {
        $lookup: {
          from: "services",
          localField: "bookingDetails.parentId",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      { $unwind: "$serviceDetails" },
      {
        $facet: {
          overAll: [
            {
              $group: {
                _id: "$paymentMethod",
                total: { $sum: "$total" },
              },
            },
            {
              $group: {
                _id: null,
                cash: {
                  $sum: { $cond: [{ $eq: ["$_id", "cash"] }, "$total", 0] },
                },
                zelle: {
                  $sum: { $cond: [{ $eq: ["$_id", "zelle"] }, "$total", 0] },
                },
                credit_card: {
                  $sum: {
                    $cond: [{ $eq: ["$_id", "credit_card"] }, "$total", 0],
                  },
                },
              },
            },
            { $project: { _id: 0 } },
          ],
          salesList: [
            {
              $project: {
                _id: "$bookingDetails._id",
                date: "$paymentDate",
                service: "$serviceDetails.serviceName",
                price: "$subTotal",
                tax: "$tax",
                total: "$total",
              },
            },
            { $sort: { date: 1 } },
            {
              $project: {
                _id: 1,
                date: {
                  $dateToString: {
                    format: "%d/%m/%Y",
                    date: "$date",
                    timezone: "UTC",
                  },
                },
                service: 1,
                price: 1,
                tax: 1,
                total: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$overAll" },
      {
        $replaceRoot: {
          newRoot: {
            salesList: "$salesList",
            overAll: "$overAll",
          },
        },
      },
    ]);

    if (report?.length > 0) {
      const { overAll, salesList } = report[0];
      generateSalesReport(salesList, overAll, sc_type, (pdfBuffer) => {
        res.setHeader("Content-Type", "application/json");
        let response = new Apiresponse(200, pdfBuffer.toString("base64"));
        return res.json(response);
      });
    } else {
      return res.json(new Apiresponse(200, []));
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "An error occured while creating payment."
      )
    );
  }
};

exports.getSalesReportDownloadPdf = async (req, res, next) => {
  try {
    const { startDate, endDate, tType } = req.query;
    const listType = ["cash", "zelle", "credit_card", "all"];

    if (!startDate || !endDate || !tType) {
      return next(new ApiError(400, "params are required."));
    }

    let sc_type = tType.toLowerCase();
    if (!listType.includes(sc_type)) {
      sc_type = "all";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const report = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: start,
            $lt: end,
          },
          paymentStatus: "completed",
          ...(sc_type === "all" ? {} : { paymentMethod: sc_type }),
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "bookingIds",
          foreignField: "_id",
          as: "bookingDetails",
        },
      },
      { $unwind: "$bookingDetails" },
      {
        $lookup: {
          from: "services",
          localField: "bookingDetails.parentId",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      { $unwind: "$serviceDetails" },
      {
        $facet: {
          overAll: [
            {
              $group: {
                _id: "$paymentMethod",
                total: { $sum: "$total" },
              },
            },
            {
              $group: {
                _id: null,
                cash: {
                  $sum: { $cond: [{ $eq: ["$_id", "cash"] }, "$total", 0] },
                },
                zelle: {
                  $sum: { $cond: [{ $eq: ["$_id", "zelle"] }, "$total", 0] },
                },
                credit_card: {
                  $sum: {
                    $cond: [{ $eq: ["$_id", "credit_card"] }, "$total", 0],
                  },
                },
              },
            },
            { $project: { _id: 0 } },
          ],
          salesList: [
            {
              $project: {
                _id: "$bookingDetails._id",
                date: "$paymentDate",
                service: "$serviceDetails.serviceName",
                price: "$subTotal",
                tax: "$tax",
                total: "$total",
              },
            },
            { $sort: { date: 1 } },
            {
              $project: {
                _id: 1,
                date: {
                  $dateToString: {
                    format: "%d/%m/%Y",
                    date: "$date",
                    timezone: "UTC",
                  },
                },
                service: 1,
                price: 1,
                tax: 1,
                total: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$overAll" },
      {
        $replaceRoot: {
          newRoot: {
            salesList: "$salesList",
            overAll: "$overAll",
          },
        },
      },
    ]);

    if (report.length > 0) {
      const { overAll, salesList } = report[0];
      generateSalesReport(salesList, overAll, sc_type, (pdfBuffer) => {
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=salesReport.pdf"
        );
        res.status(200).send(pdfBuffer);
      });
    } else {
      return res.json(new Apiresponse(200, []));
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        error.message || "An error occured while creating payment."
      )
    );
  }
};

function generateSalesReport(salesData, overallData, type, callback) {
  const tableBody = [
    ["Date", "Service", "Price", "Tax", "Total"],
    ...salesData.map(({ date, service, price, tax, total }) => [
      date,
      service,
      `$${price.toFixed(2)}`,
      `$${tax.toFixed(2)}`,
      `$${total.toFixed(2)}`,
    ]),
  ];
  const overallBody = [];
  let total = 0;

  if (type == "all") {
    total = overallData?.cash + overallData?.credit_card + overallData?.zelle;
  } else if (type == "cash") {
    total = overallData?.cash;
  } else if (type == "zelle") {
    total = overallData?.zelle;
  } else if (type == "credit_card") {
    total = overallData?.credit_card;
  }

  const bodyItem = [
    ["Cash", `$${overallData.cash.toFixed(2)}`],
    ["Credit Card", `$${overallData.credit_card.toFixed(2)}`],
    ["Zelle", `$${overallData.zelle.toFixed(2)}`],
    ["Total", `$${total.toFixed(2)}`],
  ];

  if (type == "all") {
    overallBody.push(...bodyItem);
  } else if (type == "cash") {
    overallBody.push(bodyItem[0], bodyItem[3]);
  } else if (type == "credit_card") {
    overallBody.push(bodyItem[1], bodyItem[3]);
  } else if (type == "zelle") {
    overallBody.push(bodyItem[2], bodyItem[3]);
  }

  const docDefinition = {
    content: [
      { text: "Sales Report", style: "header" },
      { text: "\n" },
      {
        table: {
          headerRows: 1,
          widths: ["20%", "30%", "15%", "15%", "20%"],
          body: tableBody,
        },
      },
      { text: "\nOVER ALL", style: "subHeader" },
      {
        table: {
          widths: ["50%", "50%"],
          body: overallBody,
        },
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true, alignment: "center" },
      subHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];

  pdfDoc.on("data", (chunk) => chunks.push(chunk));
  pdfDoc.on("end", () =>
    // res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=SalesReport.pdf"
    // );
    // return res.send(Buffer.concat(chunks));
    callback(Buffer.concat(chunks))
  );
  // pdfDoc.on("error", (err) => {
  //   res.status(500).send({ error: "Error generating PDF" });
  // });
  pdfDoc.end();
}
