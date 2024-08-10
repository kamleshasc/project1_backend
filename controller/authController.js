const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  adminScreen,
  employeeScreen,
  customerScreen,
} = require("../utils/helper");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "All fields are required!"));
    }
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return next(new ApiError(401, "email or password is incorrect."));
    }
    const checkPassword = await bcrypt.compare(password, userFound.password);
    if (checkPassword) {
      let data = {
        userDetails: userFound,
        screens: [],
        token: "",
        refreshToken: "",
      };

      if (userFound.userType == "admin" && userFound.isAdmin) {
        data.screens = adminScreen;
      } else if (userFound.userType == "employee") {
        data.screens = employeeScreen;
      } else {
        data.screens = customerScreen;
      }

      let response = new ApiResponse(200, data);
      return res.json(response);
    }
    return next(new ApiError(401, "email or password is incorrect."));
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error user login" });
    return next(new ApiError(500, error?.message || "Error user login."));
  }
};
