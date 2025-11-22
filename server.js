const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();
const functions = require("firebase-functions");

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "*", // or your frontend URL
  credentials: true
}));

// Importing routes
const authRoutes = require('./routes/Auth');
const userRoutes = require('./routes/User');
const contactRoutes = require('./routes/Contact');
const adminRoutes = require('./routes/Admin');
const apiRoutes = require('./routes/Routes_Api');

// Mount routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use("/api/v1/contacts", contactRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.send("This is Home page");
});

// DB connection
const { DbConnect } = require('./config/databse');
DbConnect();

// ✅ Only start server locally (for development)
if (!process.env.FUNCTION_NAME) {
  app.listen(port, () => {
    console.log(`App is running locally on port ${port}`);
  });
}

// ✅ Export API for Firebase Functions
exports.api = functions.https.onRequest(app);