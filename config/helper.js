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

module.exports = {
  DateFormateMMMMDDYYY,
  formatMobileNumber,
};
