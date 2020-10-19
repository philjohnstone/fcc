var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const issueSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    // default blank?
    type: String
  },
  status_text: {
    // default blank?
    type: String
  },
  open: {
    // default true?
    type: Boolean
  },
  created_on: {
    // default date
    type: Date
  },
  updated_on: {
    type: Date
  }
});

var Issue = mongoose.model('Issue', issueSchema);

var createAndSaveIssue = (issueFields, done) => {
  var created_on = new Date();
  var newIssue = {...issueFields};
  newIssue.open = true;
  newIssue.created_on = created_on;
  newIssue.updated_on = created_on;
  var issue = new Issue(newIssue);
  issue.save((err, data) => {
    if (err) {
      return console.log("Couldn't create issue: " + err);
    }
    done(null, data);
  });
};

var findAndUpdateIssue = (id, update, done) => {
  var updated_on = new Date();
  var filter = { _id: id };
  Issue.findOneAndUpdate(
    filter,
    update,
    { new: true, useFindAndModify: false },
    (err, data) => {
      if (err) return console.log(err);
      done(null, data);
    }
  );
};

exports.Issue = Issue;
exports.createAndSaveIssue = createAndSaveIssue;
exports.findAndUpdateIssue = findAndUpdateIssue;
