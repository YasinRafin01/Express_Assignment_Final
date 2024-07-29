// upload.js
const multer = require('multer');
const path = require('path');

// Set the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/hotel1'); // specify the folder to store the files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // set the file name
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // limit file size to 5MB per file
  fileFilter: (req, file, cb) => {
    // Validate file type
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    
    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
}).array('images', 10); // handle multiple files, up to 10
// 'images' should match the field name in the form-data, and 10 is the max count

module.exports = upload;