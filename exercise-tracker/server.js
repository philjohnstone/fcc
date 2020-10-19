const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, 
                { useNewUrlParser: true, useUnifiedTopology: true }, 
                (err, database) => {
  if (err) {
    console.log('err when connecting to db: ' + err);
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
});

var User = mongoose.model('User', userSchema);

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

var Exercise = mongoose.model('Exercise', exerciseSchema);

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// User story 1
app.post("/api/exercise/new-user", (req, res) => {
  var user = new User({ username: req.body.username });
  user.save((err, data) => {
    if (err) return console.log("Error creating user: " + err);
  });
  res.json({ 
    _id: user._id, 
    username: user.username });
});

// User story 2
app.get("/api/exercise/users", (req, res) => {
  User.find({})
      .select('-__v')
      .exec((err, data) => {
    if (err) return console.log("Error listing users: " + err);
    res.json(data);
  });
});

// User story 3
app.post("/api/exercise/add", (req, res) => {
  User.findOne({ _id: req.body.userId }, (err, user) => {
    if (err) return console.log("Cannot find user: " + err);
    var exercise = { 
      userId: req.body.userId,
      date: req.body.date ? req.body.date : new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()), 
      description: req.body.description, 
      duration: parseInt(req.body.duration) 
    };
    var exercise = new Exercise(exercise);
    exercise.save((err, data) => {
      if (err) return console.log("Error creating exercise: " + err);
      res.json({
        _id: user._id,
        username: user.username,
        date: exercise.date.toDateString(),
        duration: exercise.duration,
        description: exercise.description
      });
    });
  })
});

// User story 4 & 5
app.get("/api/exercise/log", (req, res) => {
  var filter = {
    userId: req.query.userId
  };
  if (req.query.from && req.query.to) {
    filter.date = {
      $gte: req.query.from,
      $lte: req.query.to
    };
  }
  var limit = req.query.limit ? parseInt(req.query.limit) : 1000;
  User.findOne({ _id: req.query.userId }, (err, user) => {
    if (err) return console.log("Cannot find user: " + err);
    
    Exercise.find( filter )
            .sort({ date: 'asc' })
            .limit(limit)
            .select('-__v')
            .exec((err, exercises) => {
              if (err) return console.log("Cannot find exercises: " + err);
              res.json({
                userId: user._id,
                username: user.username,
                count: exercises.length,
                log: exercises
              });
            });
  });
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
