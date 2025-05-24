// auth routes only for authentication for login and register
// user routes for all tweets function
require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require('express-session');
const { connectToDB, getDb } = require("./db");
const app = express();
const PORT = process.env.PORT || 2000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');

// Configuration
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'shree9110',
  resave: false,
  saveUninitialized: false
}));

// Connect to DB
connectToDB((err) => {
  if (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

// Routes
app.use('/', authRoutes);
app.use('/', tweetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});
