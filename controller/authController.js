const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  adminScreen,
  employeeScreen,
  customerScreen,
} = require("../utils/helper");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");
const jwt = require("jsonwebtoken");
const otpController = require("./otpController");

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "All fields are required!"));
    }
    const userFound = await User.findOne({ email, status: "Active" });

    if (!userFound) {
      return next(new ApiError(401, "User not found."));
    }
    const checkPassword = await bcrypt.compare(password, userFound.password);

    if (checkPassword) {
      const { accessToken, refreshToken } =
        await generateAccessAndRefereshTokens(userFound._id);

      const loggedInUser = await User.findById(userFound._id).select(
        "-password -refreshToken"
      );

      let data = {
        userDetails: loggedInUser,
        screens: [],
        token: accessToken,
        refreshToken,
      };

      if (userFound.userType == "admin" && userFound.isAdmin) {
        data.screens = adminScreen;
      } else if (userFound.userType == "employee") {
        data.screens = employeeScreen;
      } else {
        data.screens = customerScreen;
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      return (
        res
          .status(200)
          // .cookie("accessToken", accessToken, options)
          // .cookie("refreshToken", refreshToken, options)
          .json(new ApiResponse(200, data, "User Logged In Successfully"))
      );

      // let response = new ApiResponse(200, data);
      // return res.json(response);
    }
    return next(new ApiError(401, "email or password is incorrect."));
  } catch (error) {
    console.error(error);
    // return res.status(500).json({ error: "Error user login" });
    return next(new ApiError(500, error?.message || "Error user login."));
  }
};

exports.refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken = req?.body?.refreshToken;

    if (!incomingRefreshToken) {
      return next(new ApiError(403, "Refresh token not found."));
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      return next(new ApiError(403, "unauthorized request."));
    }

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return next(new ApiError(403, "Invalid refresh token."));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return next(new ApiError(403, "Refresh token is expired or used."));
    }

    // const options = {
    //   httpOnly: true,
    //   secure: true,
    // };

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    let data = {
      token: accessToken,
      refreshToken,
    };

    return (
      res
        .status(200)
        // .cookie("accessToken", accessToken, options)
        // .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(200, data, "Access token refreshed."))
    );
  } catch (error) {
    return next(new ApiError(500, error?.message || "Invalid refresh token."));
  }
};

exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // this removes the field from document
        },
      },
      {
        new: true,
      }
    );

    // const options = {
    //   httpOnly: true,
    //   secure: true,
    // };

    return (
      res
        .status(200)
        // .clearCookie("accessToken", options)
        // .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
    );
  } catch (error) {
    return next(new ApiError(500, error?.message || "Error while logout."));
  }
};

// exports.forgotPassword = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       return next(new ApiError(404, "User not found."));
//     }

//     const resetToken = await user.generateResetToken();

//     await user.save({ validateBeforeSave: false });

//     const resetPasswordLink = `${req.protocol}://${req.get(
//       "host"
//     )}/api/v1/auth/reset-password/${resetToken}`;

//     const message = `Forgot Password Link: ${resetPasswordLink}`;

//     // await sendEmail({
//     //   email: user.email,
//     //   subject: "Password Reset",
//     //   message,
//     // });

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(200, {}, "Password reset link sent to your email.")
//       );
//   } catch (error) {
//     return next(
//       new ApiError(500, error?.message || "Error while sending mail.")
//     );
//   }
// };

// exports.resetPassword = async (req, res, next) => {
//   try {
//     const resetToken = crypto
//       .createHash("sha256")
//       .update(req.params.resetToken)
//       .digest("hex");

//     const user = await User.findOne({
//       resetToken,
//       resetTokenExpiration: { $gt: Date.now() },
//     });

//     if (!user) {
//       return next(new ApiError(400, "Invalid or expired reset token."));
//     }

//     user.password = req.body.password;
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;

//     await user.save({ validateBeforeSave: false });

//     return res
//       .status(200)
//       .json(new ApiResponse(200, {}, "Password updated successfully."));
//   } catch (error) {
//     return next(
//       new ApiError(500, error?.message || "Error while updating password.")
//     );
//   }
// };

exports.changePassword = async (req, res, next) => {
  try {
    let userId = req?.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ApiError(404, "User not found."));
    }
    const checkPassword = await user.matchPassword(req?.body?.oldPassword);

    if (!checkPassword) {
      return next(new ApiError(400, "Old password does not match."));
    }
    user.password = req?.body?.newPassword;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password changed successfully."));
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error while changing password.")
    );
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new ApiError(400, "All fields are required."));
    }

    const user = await User.findOne({ email, status: "Active" });
    if (!user) {
      return next(new ApiError(404, "User not found."));
    }

    const verifyOTP = await otpController.verifyOTP(email, otp);
    if (!verifyOTP.success) {
      return next(new ApiError(400, verifyOTP.message));
    }
    let userId = {
      id: user._id,
    };

    // user.password = password;
    // await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, userId, "OTP verified successfully."));
  } catch (error) {
    console.log(error, "errrr");

    return next(
      new ApiError(500, error?.message || "Error while changing password.")
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return next(new ApiError(400, "User not found."));
    }

    const user = await User.findOne({ _id: id, status: "Active" });
    if (!user) {
      return next(new ApiError(400, "User not found."));
    }

    user.password = password;
    await user.save({ validateBeforeSave: false });

    return res.json(new ApiResponse(200, {}, "Password reset successfully."));
  } catch (error) {
    return next(
      new ApiError(500, error?.message || "Error while changing password.")
    );
  }
};
