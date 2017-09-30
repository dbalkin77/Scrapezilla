var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

var Article = require('./models/Article.js');
var Comment = require('./models/Comment.js');

var app = express();
var uri =  "mongodb://heroku_hzv7t8hl:q9bd821e9rt3u6jumtq9gh5bl9@ds135514.mlab.com:35514/heroku_hzv7t8hl"

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));

mongoose.connect(uri , function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Routes
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
        .populate('comments')
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                // console.log(doc);
                res.render('articleComments', {
                    article: doc
                });
            }
        });
});

app.post('/articles/:id', function (req, res) {
    var comment = req.body;
    var newComment = new Comment(comment);

    newComment.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            var articleId = req.params.id;
            Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments': doc._id}})
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
    var commentId = req.params.cId;

    Article.update({'_id': articleId}, {$pull: {'comments': commentId}}, {'multi': false}, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            Comment.remove({'_id': commentId}, function (err, res) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Successful deletion of comment');
                }
            });
        }
    });

    res.redirect('/articles/' + articleId);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});