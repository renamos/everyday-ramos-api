// server.js

// BASE SETUP
// =============================================================================
var config = require('./config.js')
// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var imageRoutes = require('./routes/images-routes.js');
var cloudinary = require('cloudinary');


cloudinary.config({
    cloud_name: 'photog',
    api_key: '985422917755516',
    api_secret: 'zcjkCNHqF0_IRWAjWj0km7zpESg'
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json({limit: '50mb'}));


var port = process.env.PORT || 8000; // set our port

mongoose.connect(config.databaseURL); // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function () {
    console.log('Connected to a database')
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/images', imageRoutes);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);