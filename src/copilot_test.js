// Express server on port 3000

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Return the current time
app.get('/time', function(req, res) {
  var time = new Date();
  res.send(time);
});
