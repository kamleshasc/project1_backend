const OTP = require("./../models/otp");
const ApiError = require("./../utils/ApiError");
const ApiResponse = require("./../utils/Apiresponse");
const Helper = require("../utils/helper");
const User = require("../models/user");

exports.signUpOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ApiError(400, "Email is required."));
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return next(new ApiError(400, "Email already exists."));
    }

    const otpValue = Helper.generateOTP();
    const currentTime = Helper.getCurrentDateZone();
    // const currentTime = Helper.getDateInNewYorkTimeZoneMoment();
    const expirationTimeUTC = new Date(Date.now() + 2 * 60 * 1000);

    let otpRecord = await OTP.findOne({ email });

    if (otpRecord) {
      // Convert UTC expirationDate from the database to the local timezone
      const expirationTimeInLocal = new Date(otpRecord.expiredDate);
      // Check if the OTP is still valid (convert current time to UTC for comparison)
      if (currentTime.getTime() < expirationTimeInLocal.getTime()) {
        const timeLeft =
          (expirationTimeInLocal.getTime() - currentTime.getTime()) / 1000; // Time left in seconds
        let message = `Please wait for ${Math.ceil(
          timeLeft / 60
        )} minutes to request a new OTP.`;

        return res.json(new ApiResponse(400, {}, message));
      } else {
        // OTP has expired, update with a new OTP and expiration time in UTC
        otpRecord.otp = otpValue;
        otpRecord.expiredDate = expirationTimeUTC;
        await otpRecord.save();
      }
    } else {
      // No existing OTP for the email, create a new record
      otpRecord = new OTP({
        email,
        otp: otpValue,
        expiredDate: expirationTimeUTC,
      });
      await otpRecord.save();
    }

    const transporter = Helper.transporter();
    const mailOptions = Helper.signUpMailFormat(email, otpValue);

    await transporter.sendMail(mailOptions);

    return res.json(new ApiResponse(201, {}, "OTP sent successfully"));
  } catch (error) {
    return next(new ApiError(500, error?.message || "Error generating OTP."));
  }
};

exports.forgotOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ApiError(400, "Email is required."));
    }

    const userExist = await User.findOne({ email, status: "Active" });

    if (!userExist) {
      return next(new ApiError(400, "User not found."));
    }

    const otpValue = Helper.generateOTP();
    const currentTime = Helper.getDateInNewYorkTimeZoneMoment();
    const expirationTimeUTC = new Date(Date.now() + 2 * 60 * 1000);

    let otpRecord = await OTP.findOne({ email });

    if (otpRecord) {
      // Convert UTC expirationDate from the database to the local timezone
      const expirationTimeInLocal = new Date(otpRecord.expiredDate);
      // Check if the OTP is still valid (convert current time to UTC for comparison)
      if (currentTime.getTime() < expirationTimeInLocal.getTime()) {
        const timeLeft =
          (expirationTimeInLocal.getTime() - currentTime.getTime()) / 1000; // Time left in seconds
        let message = `Please wait for ${Math.ceil(
          timeLeft / 60
        )} minutes to request a new OTP.`;

        return res.json(new ApiResponse(400, {}, message));
      } else {
        // OTP has expired, update with a new OTP and expiration time in UTC
        otpRecord.otp = otpValue;
        otpRecord.expiredDate = expirationTimeUTC;
        await otpRecord.save();
      }
    } else {
      // No existing OTP for the email, create a new record
      otpRecord = new OTP({
        email,
        otp: otpValue,
        expiredDate: expirationTimeUTC,
      });
      await otpRecord.save();
    }

    const transporter = Helper.transporter();
    const mailOptions = Helper.forgotMailFormat(email, otpValue);

    await transporter.sendMail(mailOptions);

    return res.json(new ApiResponse(201, {}, "OTP sent successfully"));
  } catch (error) {
    return next(new ApiError(500, error?.message || "Error sending OTP."));
  }
};

exports.verifyOTP = async (mail, otp) => {
  try {
    const otpRecord = await OTP.findOne({ email: mail })
      .sort({ expiredDate: -1 })
      .exec();

    if (!otpRecord) {
      return { success: false, message: "No OTP found for this email." };
    }

    // Check if the OTP has expired (2 minutes)
    const nowUTC = new Date();
    if (nowUTC > otpRecord.expiredDate) {
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      };
    }

    // Check if OTP is valid
    if (otpRecord.otp !== otp) {
      return { success: false, message: "Invalid OTP." };
    }
    otpRecord.expiredDate = null;
    await otpRecord.save({ validateBeforeSave: false });

    return { success: true, message: "OTP verified successfully." };
  } catch (error) {
    console.log(error, "errr");

    return { success: false, message: "Error verifying OTP" };
  }
};
