// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

var parseDate = (dateString) => {
  if (dateString == null) return new Date();
  // year has 4 digits, unix timestamp has more
  if (/\d{5,}/.test(dateString))return new Date(parseInt(dateString));
  return new Date(dateString);
};

app.get("/api/timestamp/:date_string?", (req, res) => {
  var date = parseDate(req.params.date_string);
  if (isNaN(date)) {
    res.json({"error" : "Invalid Date" });
  } else {
    res.json({ "unix": parseInt(date.getTime()), "utc": date.toUTCString() });
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
