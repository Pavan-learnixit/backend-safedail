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
const AuthRoutes = require('./routes/Auth');
const UserRoutes = require('./routes/User');
const ContactRoutes = require('./routes/Contact');
const apiRoutes = require('./routes/Routes_Api');
const spamRoutes = require('./routes/spam'); 
const authRoutes=require('./routes/Auth.js');
// Mount routes
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/contact', ContactRoutes);
app.use('/api/v1/info', addInfoRoutes);
app.use('/api/v1/api', apiRoutes);
//Spam Routes
app.use('/spam', spamRoutes)

// Home route
app.get('/', (req, res) => {
  res.send("This is Home page");
});

// DB connection
const { DbConnect } = require('./config/databse');
DbConnect();

//  Only start server locally (for development)
if (!process.env.FUNCTION_NAME) {
  app.listen(port, () => {
    console.log(`App is running locally on port ${port}`);
  });
}

// Export API for Firebase Functions
exports.api = functions.https.onRequest(app);

