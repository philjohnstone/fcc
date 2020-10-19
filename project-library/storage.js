var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  commentcount: {
    type: Number,
    default: 0
  }
});

const commentSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

var Book = mongoose.model('Book', bookSchema);
var Comment = mongoose.model('Comment', commentSchema);

exports.Book = Book;
exports.Comment = Comment;
