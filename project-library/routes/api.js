/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  var Book = require('../storage.js').Book;
  var Comment = require('../storage.js').Comment;

  app.route('/api/books')
    .get(function (req, res){
      Book.find({})
          .exec((err, data) => {
            if (err) {
              res.send(err);
            } else {
              res.json(data)
            }
          });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (!title) {
        res.send('missing title');
      } else {
        var book = new Book({title});
        book.save((err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.json(data);
          }
        });
      }
    })
    
    .delete(function(req, res){
      Comment.deleteMany({}, (commentErr, commentData) => {
        if (commentErr) {
          res.send(commentErr);
        } else {
          Book.deleteMany({}, (bookErr, bookData) => {
            if (bookErr) {
              res.send(bookErr);
            } else {
              res.send('complete delete successful');
            }
          });
        }
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findOne({ _id: bookid }, (bookErr, bookData) => {
        if (bookErr || !bookData) {
          res.send('No book exists');
        } else {
          Comment.find({ bookId: bookData._id }, (commentErr, commentData) => {
            if (commentErr) {
              res.send(commentErr);
            } else {
              res.json({
                _id: bookData._id,
                title: bookData.title,
                comments: commentData.length == 0 ? [] : commentData.map(comment => comment.comment)
              });
            }
          });
        }
      });
    })
    
    .post(function(req, res){
      var bookId = req.params.id;
      var comment = req.body.comment;
      Book.findOne({ _id: bookId }, (bookErr, bookData) => {
        if (bookErr || !bookData) {
          res.send('No book exists');
        } else {
          new Comment({ bookId, comment }).save((newCommentErr, newCommentData) => {
            if (newCommentErr) {
              res.send(newCommentErr);
            } else {
              Comment.find({ bookId: bookData._id }, (commentErr, commentData) => {
                if (commentErr) {
                  res.send(commentErr);
                } else {
                  res.json({
                    _id: bookData._id,
                    title: bookData.title,
                    comments: commentData.length == 0 ? [] : commentData.map(comment => comment.comment)
                  });
                }
              });
            }
          });
        }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.deleteOne({ _id: bookid }, (commentErr, commentData) => {
        if (commentErr || commentData.ok != 1 || commentData.deletedCount == 0) {
          res.send('No book exists');
        } else {
          Comment.deleteMany({ bookId: bookid }, (commentErr, commentData) => {
            res.send('delete successful');
          });
        }
      });
    });
  
};

