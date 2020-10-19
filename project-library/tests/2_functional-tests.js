/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

var Book = require('../storage.js').Book;
var Comment = require('../storage.js').Comment;

suite('Functional Tests', function() {

  before(() => {
    // Cleardown
    Comment.deleteMany({}, (err, result) => { 
      Book.deleteMany({}, (err, result) => {});
    });
  });

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Test POST book title'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.title, 'Test POST book title', 'Title should be returned');
          assert.isNotNull(res.body._id, '_id should exist');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html', 'Response should be text');
          assert.equal(res.text, 'missing title', 'Book should not be created without mandatory fields');
          done();
        });
      });
      
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        var books = [
          { title: 'Test GET Book 1' },
          { title: 'Test GET Book 2' }
        ];
        Book.insertMany(books, (err, data) => {
          if (err) {
            return console.log(err);
          }
          chai.request(server)
          .get('/api/books')
          .query({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.equal(res.body.length, books.length);
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            assert.equal(res.body[0].title, books[0].title);
            assert.equal(res.body[1].title, books[1].title);
            done();
          });
        });
        
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/123456789012')
        .query({})
        .end(function(err, res){
          if (err) {
            return console.log(err);
          }
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html', 'Response should be text');
          assert.equal(res.text, 'No book exists', 'Book not found message should be returned');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db', function(done){
        var book = new Book({ title: 'Test GET with valid ID' });
        book.save((err, data) => {
          if (err) {
            return console.log(err);
          } else {
            chai.request(server)
            .get('/api/books/' + data._id)
            .query({})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.type, 'application/json', "Response should be json");
              assert.equal(res.body._id, data._id, 'Returned _id should match');
              assert.equal(res.body.title, data.title, 'Returned title should match');
              assert.isArray(res.body.comments);
              assert.equal(res.body.comments.length, 0, 'There should not be any comments');
              done();
            });
          }
        });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        var book = new Book({ title: 'Test POST with comment' });
        book.save((err, data) => {
          if (err) {
            return console.log(err);
          } else {
            var comment = 'This is the first comment';
            chai.request(server)
            .post('/api/books/' + data._id)
            .send({ comment })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.type, 'application/json', "Response should be json");
              assert.equal(res.body._id, data._id, 'Returned _id should match');
              assert.equal(res.body.title, data.title, 'Returned title should match');
              assert.isArray(res.body.comments);
              assert.equal(res.body.comments.length, 1, 'One comment should be returned');
              assert.equal(res.body.comments[0], comment, 'Comment text should match');
              done();
            });
          }
        });
      });
      
    });

    suite('DELETE /api/books', () => {

      test('Test DELETE all books', (done) => {

        new Book({ title: 'DELETE /api/books' }).save((err, data) => {
          if (err) {
            return console.log(err);
          }
          chai.request(server)
          .delete('/api/books')
          .send({})
          .end(function(err, res){
            if (err) {
              return console.log(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html', 'Response should be text');
            assert.equal(res.text, 'complete delete successful', 'All books deleted message should be returned');
            done();
          });
        });

      });

    });

    suite('DELETE /api/books/[id]', () => {

      test('Test DELETE single book', (done) => {

        new Book({ title: 'DELETE /api/books/[id]' }).save((err, data) => {
          if (err) {
            return console.log(err);
          }
          chai.request(server)
          .delete('/api/books/' + data._id)
          .send({})
          .end(function(err, res){
            if (err) {
              return console.log(err);
            }
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html', 'Response should be text');
            assert.equal(res.text, 'delete successful', 'Single book deleted message should be returned');
            done();
          });
        });

      });

    });

  });

});

