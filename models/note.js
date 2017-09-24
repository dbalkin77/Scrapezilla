// Require mongoose
const mongoose = require("mongoose");
// Create Schema class
const noteSchema =  new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

var Note = mongoose.model('Note', noteSchema);

module.exports = Note;

