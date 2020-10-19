'use strict';

var bodyParser = require('body-parser');
var crypto = require('crypto');
var dns = require('dns');
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

const PREFIX = "https://short-shell-foxtail.glitch.me/api/shorturl/";

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const urlShortenerSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  }
});
var UrlShortener = mongoose.model('UrlShortener', urlShortenerSchema);

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/shorturl/:short", (req, res) => {
  // TODO retrieve
  UrlShortener.find({ hash: req.params.short }, (err, data) => {
    if (err) {
      return console.log('Error retrieving: ' + err);
    }
    console.log('Retrieved: ' + data);
    res.redirect(data.originalUrl);
  });
});

app.post("/api/shorturl/new", function (req, res) {
  let address = req.body.url.replace('https://', '').replace('http://', '');
  if (dns.lookup(address, { hints: dns.ADDRCONFIG | dns.V4MAPPED }, (err, addresses) => {
    if (err) {
      return res.json({ "error": "invalid URL" });
    }
    var short = crypto.createHash('sha1').update(address).digest('hex').substr(0,9);
    var urlShort = new UrlShortener({ hash: short, originalUrl: req.body.url, shortUrl: PREFIX + short });
    urlShort.save((err, data) => {
      if (err) {
        return console.log('Error saving: ' + err);
      }
      console.log('Saved: ' + data);
    })
    res.json({ "original_url": req.body.url, "short_url": PREFIX + short });  
  }));
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
