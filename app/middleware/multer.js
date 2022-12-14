const multer = require("multer");

// Dictionary of image file types
/*********************************/
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
};

// Configurations for saving images and their file names
/*******************************************************/
const upload = multer({
  storage: multer.diskStorage({
    // destination folder
    destination: (req, file, cb) => {
      cb(null, "app/images");
    },
    // image file name
    filename: (req, file, cb) => {
      // replace space by underscore
      const name = file.originalname.split(" ").join("_");
      const extension = MIME_TYPES[file.mimetype];
      cb(null, name + Date.now() + "." + extension);
    },
  }),
  // file size limit : 2Mo
  limits: {
    fileSize: 2000000,
  },
  // checks if the format type is valid
  fileFilter: (req, file, cb) => {
    const extension = MIME_TYPES[file.mimetype];
    if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      extension === "gif" ||
      extension === "webp"
    ) {
      cb(null, true);
    } else {
      cb("Error : Wrong file type", false);
    }
  },
});

// exports the single image file
module.exports = multer(upload).single("image");
