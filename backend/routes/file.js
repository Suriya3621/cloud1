const express = require('express');
const router = express.Router();
const FileUpload = require('../models/File.js');
const { body, validationResult } = require('express-validator');
const mime = require('mime-types');
const urlValidator = require('valid-url');
const mongoose = require('mongoose');

// Extract file extension from URL
function getFileExtensionFromUrl(url) {
  const fileName = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?') !== -1 ? url.indexOf('?') : url.length);
  return fileName.split('.').pop();
}

// Upload a new file
router.post('/uploadFile', [
  body('username').isString().notEmpty().trim().escape(),
  body('name').isString().notEmpty().trim().escape(),
  body('url').isString().notEmpty().custom(value => {
    if (!urlValidator.isUri(value)) {
      throw new Error('Invalid URL');
    }
    return true;
  }),
  body('fileSize').isString().notEmpty().trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
  }

  try {
    const fileExtension = getFileExtensionFromUrl(req.body.url);
    const fileType = mime.lookup(fileExtension) || 'application/octet-stream'; // Default MIME type

    const newFile = await FileUpload.create({
      ...req.body,
      fileType
    });

    res.status(201).send({ success: true, file: newFile });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

router.get('/allfiles', async (req, res) => {
  try {
    const files = await FileUpload.find({});
    res.status(200).send({ success: true, data: files });
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

router.get('/findfile', async (req, res) => {
  try {
    const { username } = req.query;
    const files = await FileUpload.find({ username });
    res.status(200).send({ success: true, data: files });
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

// Update file
router.put('/update/:id', async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ success: false, errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, privates } = req.body;

    // Find the file by ID and update it in one step
    const updatedFile = await FileUpload.findByIdAndUpdate(
      id,
      { name, privates },
      { new: true, runValidators: true } // Options: return the updated document and run validators
    );

    if (!updatedFile) {
      return res.status(404).send({ success: false, message: 'File not found' });
    }

    // Respond with the updated file data
    res.status(200).send({ success: true, data: updatedFile });
  } catch (err) {
    console.error('Error updating file:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});


// Delete file
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await FileUpload.findById(id);
    if (!file) {
      return res.status(404).send({ success: false, message: "File not found" });
    }

    await FileUpload.findByIdAndDelete(id);
    res.status(200).send({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).send({ success: false, error: err.message });
  }
});

module.exports = router;