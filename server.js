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

mongoose.connect("mongodb://localhost/Scrapezilla");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes //
// A GET request to scrape the contents of the website
app.get('/scrape', function (req, res) {
    res.send("Hello, world");
});

app.get('/testschema', function (req, res) {
    // construct a new article object
    // save to your database
    // send database response to the view
    // response should have newly created article object
    // if not, something went wrong.
    res.send("Hello, world");
});


// Listen on port 3000
app.listen(3000, function() {
    // Request to grab body of html with request
    request("http://www.npr.org/sections/news/", function (error, response, html){
        // Load into cheerio and save it into $ for a shorthand selector
        var $ = cheerio.load(html);

        $("a h2").each(function(i, element) {

            // Save an empty Result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");
        });
    });     
});

