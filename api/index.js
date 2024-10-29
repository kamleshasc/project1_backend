const express = require("express");
const apiRouter = express.Router();

const newUserRouter = require("./routes/user_routes");
const serviceRouter = require("./routes/service_routes");
const clientRouter = require("./routes/client_routes");
const inventoryRouter = require("./routes/inventory_routes");
const commissionRouter = require("./routes/commissionRule_routes");
const invoiceRouter = require("./routes/invoice_routes");
const bookingRouter = require("./routes/booking_routes");
const authRouter = require("./routes/auth_routes");
const privacyPolicyRouter = require("./routes/privacyPolicy_routes");
const otpRouter = require("./routes/otp_routes");

//API endpoint for Users Module
apiRouter.use("/users", newUserRouter);
//API endpoint for Services Module
apiRouter.use("/services", serviceRouter);
//API endpoint for Client Module
apiRouter.use("/clients", clientRouter);
//API endpoint for Inventory Module
apiRouter.use("/inventory", inventoryRouter);
//API endpoint for Commission Rule Module
apiRouter.use("/commissionrules", commissionRouter);
//API endpoint for Invoice Module
apiRouter.use("/invoices", invoiceRouter);
//API endpoint for Booking Module
apiRouter.use("/bookings", bookingRouter);
//API endpoint for Booking Module
apiRouter.use("/auth", authRouter);
//API endpoint for Privacy Policy Module
apiRouter.use("/privacyPolicy", privacyPolicyRouter);
//API endpoint for OTP Module
apiRouter.use("/otp", otpRouter);

module.exports = apiRouter;
