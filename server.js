const cheerio = require("cheerio");
const request = require("request");
const express = require("express");
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');

// Set mongoose to leverage built in JavaScript ES6b Promises
mongoose.Promise = Promise;

const app = express();
