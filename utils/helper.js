const nodemailer = require("nodemailer");
const timeZone = "Asia/Kolkata";
const emailTemplate = require("./HtmlTemplates");

const SERVICE = process.env.EMAIL_SERVICE || "";
const USER_EMAIL = process.env.EMAIL_USER || "";
const PASS = process.env.EMAIL_PASS || "";

const DateFormateMMMMDDYYY = (value) => {
  const date = new Date(value);
  const month = date.toLocaleString("en-GB", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate;
};

const formatMobileNumber = (mobileNumber) => {
  const area = String(mobileNumber.area).padStart(3, "0");
  const exchange = String(mobileNumber.exchange).padStart(3, "0");
  const subscriber = String(mobileNumber.subscriber).padStart(4, "0");
  return area + exchange + subscriber;
};

const frontEndScreens = [
  "Dashboard",
  "Employees",
  "Services",
  "Clients",
  "Inventory",
  "CommissionRules",
  "Invoices",
  "Bookings",
  "Customers",
  "Book",
  "MyBooking",
];

const frontendScreenOptions = {
  Dashboard: frontEndScreens[0],
  Employees: frontEndScreens[1],
  Services: frontEndScreens[2],
  Clients: frontEndScreens[3],
  Inventory: frontEndScreens[4],
  CommissionRules: frontEndScreens[5],
  Invoice: frontEndScreens[6],
  Bookings: frontEndScreens[7],
  Customers: frontEndScreens[8],
  Book: frontEndScreens[9],
  MyBooking: frontEndScreens[10],
  All: frontEndScreens,
};

const adminScreen = frontendScreenOptions.All;
const employeeScreen = [
  // frontendScreenOptions.Dashboard,
  frontendScreenOptions.Bookings,
];
const customerScreen = [
  frontendScreenOptions.Dashboard,
  frontendScreenOptions.Book,
  frontendScreenOptions.MyBooking,
];

const getCurrentTimeZone = () => {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timeZone,
  };

  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", options); // 'en-US' formats to HH:MM in 24-hour format
  return formatter.format(now);
};

const getCurrentDateZone = () => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: timeZone,
  };

  const now = new Date();

  // Format date and time according to the specified time zone
  const formatter = new Intl.DateTimeFormat("en-CA", options);
  const parts = formatter.formatToParts(now);

  // Extract date and time parts
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;
  const second = parts.find((part) => part.type === "second")?.value;

  // Construct a date string in ISO format
  const isoDateString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

  // Return a new Date object, which will be in the local time zone of the environment
  return new Date(isoDateString);
};

//renerate OTP of 6 digits
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = () => {
  return nodemailer.createTransport({
    service: SERVICE,
    auth: {
      user: USER_EMAIL,
      pass: PASS,
    },
  });
};

const signUpMailFormat = (email, otpValue) => {
  return {
    from: "ascsolutions.n@gmail.com",
    to: email,
    subject: "Your Signup OTP Code",
    html: emailTemplate.signUpOTPTemplate(otpValue),
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      "X-Mailer": "Nodemailer",
    },
  };
};

const forgotMailFormat = (email, otpValue) => {
  return {
    from: USER_EMAIL,
    to: email,
    subject: "Your Forgot Password OTP Code",
    // text: `Your OTP code is ${otpValue}. It will expire in 2 minutes.`,
    html: emailTemplate.forgotOTPTemplate(otpValue),
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      "X-Mailer": "Nodemailer",
    },
  };
};

const welcomeFormat = (email, userName) => {
  return {
    from: "ascsolutions.n@gmail.com",
    to: email,
    subject: "Welcome to Spa App – Your Journey to Relaxation Begins!",
    html: emailTemplate.welcomeTemplate(userName),
    headers: {
      "X-Priority": "1", // Sets email priority to high
      "X-MSMail-Priority": "High", // MS-specific header for prioritizing the email
      "X-Mailer": "Nodemailer", // Identifies the tool used to send the email
    },
  };
};

module.exports = {
  DateFormateMMMMDDYYY,
  formatMobileNumber,
  frontEndScreens,
  frontendScreenOptions,
  adminScreen,
  employeeScreen,
  customerScreen,
  getCurrentTimeZone,
  getCurrentDateZone,
  generateOTP,
  transporter,
  signUpMailFormat,
  forgotMailFormat,
  welcomeFormat,
};
