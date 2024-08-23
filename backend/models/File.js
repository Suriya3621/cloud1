const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true, unique: true }, // Ensure URL is unique
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true },
  private: { type: Boolean, default:true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FileUploads', FileSchema);