// Dependencies
const express = require("express");
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

// Scraping Tools
const cheerio = require("cheerio");
const request = require("request");

// Set mongoose to leverage built in JavaScript ES6b Promises
mongoose.Promise = Promise;

// Initialize Express
const app = express();

// Initialize bodyParser
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// // Database configuration with mongoose
// mongoose.connect("mongodb://localhost/week18day3mongoose");
// var db = mongoose.connection;

// // Show any mongoose errors
// db.on("error", function(error) {
//   console.log("Mongoose Error: ", error);
// });

// // Once logged in to the db through mongoose, log a success message
// db.once("open", function() {
//   console.log("Mongoose connection successful.");
// });

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

