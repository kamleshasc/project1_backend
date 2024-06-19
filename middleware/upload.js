const multer = require("multer");
const crypto = require("crypto");
var fs = require("fs");
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdir("./public/", (err) => {
      fs.mkdir("./public/images/", (err) => {
        cb(null, "./public/images/");
      });
    });
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}`;
    const extension = file.originalname.split(".").pop();
    cb(null, `${uniqueSuffix}.${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const acceptedFiles = [
    "image/*",
    "image/jpeg",
    "image/png",
    "application/octet-stream",
  ];
  if (acceptedFiles.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log("false");
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limit: {
    fileSize: 1024 * 1024 * 5000000,
  },
  fileFilter,
});

module.exports = upload;
