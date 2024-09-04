const ApiError = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const verifyJWT = async (req, _, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next(new ApiError(403, "Unauthorized request"));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new ApiError(403, "Invalid Access Token"));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(403, error?.message || "Invalid access token"));
  }
};

module.exports = verifyJWT;
