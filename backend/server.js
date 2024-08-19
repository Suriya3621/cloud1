const express = require('express');
const path = require('path');
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/file.js');
const { connectDB } = require("./Config/db.js");
require("dotenv").config();
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors());

// Connect to the database
connectDB();

// Routes
app.use('/api', userRoutes);
app.use('/api/file', fileRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.X_ZOHO_CATALYST_LISTEN_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});