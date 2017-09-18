// Require mongoose
const mongoose = require("mongoose");
// Create Schema class
const Schema = mongoose.Schema;

// Create Article Schema
var articleSchema = new Schema({
    headline: {
        type: String,
        required: true
    },
    sumary: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;