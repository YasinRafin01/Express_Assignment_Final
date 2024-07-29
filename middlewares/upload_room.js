const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/rooms/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload1 = multer({ storage: storage }).array('room_images'); // Ensure 'room_images' matches the form field name

module.exports = upload1;