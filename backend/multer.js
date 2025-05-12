const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (request, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
