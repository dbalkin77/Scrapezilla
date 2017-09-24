// Require mongoose
const mongoose = require("mongoose");
// Create Schema class
const Schema = mongoose.Schema;

// Create Article Schema
var articleSchema = new Schema({
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "note"
    }] 
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;