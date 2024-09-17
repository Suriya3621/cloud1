const express = require('express');
const router = express.Router();
const FileUpload = require('../models/File.js');
const { body, validationResult } = require('express-validator');
const mime = require('mime-types');
const urlValidator = require('valid-url');
const mongoose = require('mongoose');
const axios = require('axios');
const { PassThrough } = require('stream');

router.get("/download", async (req, res) => {
  const fileUrl = req.query.url;
  const fileName = req.query.name || 'downloaded_file'; // Default name if none is provided

  if (!fileUrl) {
    return res.status(400).json({ error: "File URL is required" });
  }

  try {
    const response = await axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream'
    });

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', response.headers['content-type']);

    // Pipe the file stream to the response
    response.data.pipe(res);

  } catch (error) {
    console.error("Error downloading the file:", error);
    res.status(500).send("Error downloading the file.");
  }
});

router.get("/open/:id", async (req, res) => {
  let id = req.params.id;
  if(!id){
   return res.status(400).send({
      success:false,
      message:"id required"
    })
  }
  try{
   let file = await FileUpload.findById(id)
  res.status(200).send({
      success:false,
      file
    })
  }catch(err){
    res.status(400).send({
      success:false,
     err
    })
  }
  })


// Extract file extension from URL
function getFileExtensionFromUrl(url) {
  const fileName = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?') !== -1 ? url.indexOf('?') : url.length);
  return fileName.split('.').pop();
}

// Upload a new file
router.post('/uploadFile', [
  body('id').isString().notEmpty().trim().escape(),
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

router.get('/findfile', async (req, res) => {
  try {
    const { id } = req.query;
    const files = await FileUpload.find({ id });
    console.log(files)
    res.status(200).send({ success: true, data: files });
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).send({ success: false, error: err.message });
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
router.get('/public', async (req, res) => {
  try {
    const files = await FileUpload.find({private:false});
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
    const { name, private } = req.body;

    // Find the file by ID and update it in one step
    const updatedFile = await FileUpload.findByIdAndUpdate(
      id,
      { name, private },
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