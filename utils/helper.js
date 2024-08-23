const timeZone = "Asia/Kolkata";

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
  "Users",
  "Services",
  "Clients",
  "Inventory",
  "CommissionRules",
  "Invoices",
  "Bookings",
  "Customers",
];

const frontendScreenOptions = {
  Dashboard: frontEndScreens[0],
  Users: frontEndScreens[1],
  Services: frontEndScreens[2],
  Clients: frontEndScreens[3],
  Inventory: frontEndScreens[4],
  CommissionRules: frontEndScreens[5],
  Invoice: frontEndScreens[6],
  Bookings: frontEndScreens[7],
  Customers: frontEndScreens[8],
  All: frontEndScreens,
};

const adminScreen = frontendScreenOptions.All;
const employeeScreen = [
  frontendScreenOptions.Dashboard,
  frontendScreenOptions.Bookings,
];
const customerScreen = [frontendScreenOptions.Dashboard];

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
};
