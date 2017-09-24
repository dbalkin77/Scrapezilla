// Dependencies
const express = require("express");
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

// Scraping Tools
const cheerio = require("cheerio");
const request = require("request");

// Models
const Article = require("./models/Article.js");

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

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Routes //
// A GET request to scrape the contents of the website
app.get('/', function (req, res) {
    res.redirect('/scraping');
});

app.get('/scraping', function (req, res) {
    request.get('https://news.ycombinator.com/', function (err, request, body) {
        var $ = cheerio.load(body);

        $('.title a[href^="http"], a[href^="https"]').each(function (index, element) {
            var result = {};

            result.title = $(element)[0].children[0].data
            result.link = $(element)[0].attribs.href;

            var entry = new Article(result);

            entry.save(function (err, doc) {
                if (err) {
                    console.log('Article already in database');
                } else {
                    console.log('Finished scraping');
                }
            })
        });
    });
    res.redirect('/articles');
});

app.get('/articles', function (req, res) {
    Article.find({}, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('articles', {
                articles: doc
            });
        }
    });
});

app.get('/articles/:id', function (req, res) {
    Article.findOne({'_id': req.params.id})
        .populate('notes')
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                // console.log(doc);
                res.render('articleNotes', {
                    article: doc
                });
            }
        });
});

app.post('/articles/:id', function (req, res) {
    var note = req.body;
    var newNote = new Note(note);

    newNote.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            var articleId = req.params.id;
            Article.findOneAndUpdate({'_id': articleId}, {$push: {'notes': doc._id}})
                .exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/articles/' + articleId);
                    }
                });
        }
    });
});

app.post('/articles/:aId/delete/:cId', function (req, res) {
    var articleId = req.params.aId;
    var noteId = req.params.cId;

    Article.update({'_id': articleId}, {$pull: {'notes': nodeId}}, {'multi': false}, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            Note.remove({'_id': commentId}, function (err, res) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Successful deletion of Note');
                }
            });
        }
    });

    res.redirect('/articles/' + articleId);
});

// Listen on port 3000
app.listen(3000, function() {
    console.log('app running on port 3000');
});

