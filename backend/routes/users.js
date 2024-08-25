const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const resetToken = user.getResetToken();
        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/resetpassword/${resetToken}`;

        const html = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    .btn-for-reset {
      background-color: #1F618D;
      border-radius: 10px;
      border: none;
      padding: 10px 20px;
      display: inline-block;
      font-size: 1.2em;
      color: white;
      text-decoration: none;
      cursor: pointer;
      text-align: center;
      transition: background-color 0.3s, box-shadow 0.3s;
    }

    .btn-for-reset:hover {
      background-color: #145A8A;
    }

    .btn-for-reset:focus {
      outline: 2px solid #145A8A;
      outline-offset: 2px;
    }
  </style>
</head>
<body>
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
    <h2 style="color: #0044cc;">Password Reset Request</h2>
    <p>Dear User,</p>
    <p>We received a request to reset your password. Click the link below to reset your password:</p>
    <p>
      <a href="${resetUrl}" class="btn-for-reset">
        Click here to Reset Password
      </a>
    </p>
    <p>If you didn't request a password reset, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Cloud Upload</p>
  </div>
</body>
</html>
     `;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            html
        });

        res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put('/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordTokenExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new user
router.post('/createuser', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Name, email, and password fields are required"
      });
    }

    let user = await User.create({ name, email, password });

    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        .btn-for-login {
          background-color: #1F618D;
          border-radius: 10px;
          border: none;
          padding: 10px 20px;
          display: inline-block;
          font-size: 1.2em;
          color: white;
          text-decoration: none;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.3s, box-shadow 0.3s;
        }

        .btn-for-login:hover {
          background-color: #145A8A;
        }

        .btn-for-login:focus {
          outline: 2px solid #145A8A;
          outline-offset: 2px;
        }
      </style>
    </head>
    <body>
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <h2 style="color: #0044cc;">Welcome to Our Service!😀</h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for signing up! We're excited to have you on board.</p>
        <p>It is a cloud storage app for storing your files for free.</p>
        <p>Thank you 🙏,</p>
        <b>Cloud upload</b>
      </div>
    </body>
    </html>
    `;
    await sendEmail({
      email: user.email,
      subject: 'Welcome to Cloud Storage Service',
      html
    });

    res.status(201).send({ success: true, data: user });
  } catch (err) {
    if (err.code === 11000) {
      // Check if the duplicate key is the email
      if (err.keyValue && err.keyValue.email) {
        return res.status(400).send({ success: false, message: 'Email is already registered. Please use a different email.' });
      }
      if (err.keyValue && err.keyValue.name) {
        return res.status(400).send({ success: false, message: 'Name is already registered. Please use a different name.' });
      }
      if (err.keyValue && err.keyValue.password) {
        return res.status(400).send({ success: false, message: 'Make a Strong password.' });
      }
      return res.status(400).send({ success: false,err, message: 'Duplicate key error' });
    }
    res.status(400).send({ success: false, error: err.message });
  }
});
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({ success: true, data: users });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ success: false, message: 'User not found' });
    res.status(200).send({ success: true, data: user });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ success: false, message: 'User not found' });

    user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).send({ success: true, data: user });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ success: false, message: 'User not found' });
    res.status(200).send({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Route to delete all users
router.delete('/deleteallusers', async (req, res) => {
  try {
    await User.deleteMany({}); // Delete all users
    res.status(200).send({ success: true, message: 'All users deleted' });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

// Login by name and password
router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    console.log('Request Body:', req.body); // Add this line for debugging

    if (!name || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both name and password' });
    }

    try {
        const user = await User.findOne({ name }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = user.getJwtToken();

        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});
module.exports = router;