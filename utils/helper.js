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

module.exports = {
  DateFormateMMMMDDYYY,
  formatMobileNumber,
  frontEndScreens,
  frontendScreenOptions,
  adminScreen,
  employeeScreen,
  customerScreen,
};
