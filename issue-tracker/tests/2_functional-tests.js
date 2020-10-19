/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var Issue = require('../storage.js').Issue;
var createAndSaveIssue = require('../storage.js').createAndSaveIssue;

chai.use(chaiHttp);

suite('Functional Tests', function() {

    before(() => {
      // Cleardown
      Issue.deleteMany({}, (err, result) => { });
    });
  
    suite('POST /api/issues/{project} => object with issue data', function() { 
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'POST every field',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'POST every field', 'Title should be returned');
          assert.equal(res.body.issue_text, 'text', 'Text should be returned');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in', 'Created By should be returned');
          assert.equal(res.body.assigned_to, 'Chai and Mocha', 'Assigned To should be returned');
          assert.equal(res.body.status_text, 'In QA', 'Status should be returned');
          assert.equal(res.body.open, true, 'Issue should be open');

          assert.isNotNull(res.body.created_on, 'Created On should exist');
          assert.isNotNull(res.body.updated_on, 'Updated On should exist');
          assert.isNotNull(res.body._id, '_id should exist');
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'POST required fields',
          issue_text: 'text',
          created_by: 'Functional Test - Required field filled in'
        })
        .end(function(err, res){
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json', "Response should be json");
          assert.equal(res.body.issue_title, 'POST required fields', 'Title should be returned');
          assert.equal(res.body.issue_text, 'text', 'Text should be returned');
          assert.equal(res.body.created_by, 'Functional Test - Required field filled in', 'Created By should be returned');
          assert.equal(res.body.assigned_to, '', 'Assigned To should be blank');
          assert.equal(res.body.status_text, '', 'Status should be blank');
          assert.equal(res.body.open, true, 'Issue should be open');
          
          assert.isNotNull(res.body.created_on, 'Created On should exist');
          assert.isNotNull(res.body.updated_on, 'Updated On should exist');
          assert.isNotNull(res.body._id, '_id should exist');
          done();
        });
      });
      
      test('Missing required fields', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          // issue_title intentionally missing
          issue_text: 'text',
          created_by: 'Functional Test - Required field filled in'
        })
        .end(function(err, res){
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html', 'Response should be text');
          assert.equal(res.text, 'One or more mandatory fields (title, text, created by) are missing', 'Issue should not be created without mandatory fields');
          done();
        });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        createAndSaveIssue({
          project: 'test',
          issue_title: 'PUT no body',
          issue_text: 'text',
          created_by: 'creator'
        }, (err, data) => {
          chai.request(server)
            .put('/api/issues/' + data.project)
            .send({
              _id: data._id
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.type, 'text/html', 'Response should be text');
              assert.equal(res.text, 'no updated field sent', 'Issue should not be updated without body');
              done();
            });
        });
      });
      
      test('One field to update', function(done) {
        createAndSaveIssue({
          project: 'test',
          issue_title: 'PUT one field',
          issue_text: 'text',
          created_by: 'creator'
        }, (err, data) => {
          chai.request(server)
            .put('/api/issues/' + data.project)
            .send({
              _id: data._id,
              issue_text: 'new text'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.type, 'text/html', 'Response should be text');
              assert.equal(res.text, 'successfully updated', 'Issue should be updated');
              done();
            });
        });
      });
      
      test('Multiple fields to update', function(done) {
        createAndSaveIssue({
          project: 'test',
          issue_title: 'PUT multiple fields',
          issue_text: 'text',
          created_by: 'creator'
        }, (err, data) => {
          chai.request(server)
            .put('/api/issues/' + data.project)
            .send({
              _id: data._id,
              issue_text: 'changed text',
              open: false
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.type, 'text/html', 'Response should be text');
              assert.equal(res.text, 'successfully updated', 'Issue should be updated');
              done();
            });
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        createAndSaveIssue({
          project: 'test',
          issue_title: 'GET one filter',
          issue_text: 'text',
          created_by: 'creator'
        }, (err, data) => {
          chai.request(server)
          .get('/api/issues/test')
          .query({ issue_title: 'GET one filter' })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', "Response should be json");
            assert.isArray(res.body);
            assert.equal(res.body[0]._id, data._id, '_id inserted should match returned issue _id');
            done();
          });
        });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        createAndSaveIssue({
          project: 'test',
          issue_title: 'GET multiple filters',
          issue_text: 'This test needs to be implemented',
          created_by: 'creator'
        }, (err, data) => {
          chai.request(server)
          .get('/api/issues/test')
          .query({ 
            issue_title: 'GET multiple filters',
            issue_text: 'This test needs to be implemented'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json', "Response should be json");
            assert.isArray(res.body);
            assert.equal(res.body[0]._id, data._id, '_id inserted should match returned issue _id');
            assert.equal(res.body[0].issue_title, data.issue_title, 'issue_title inserted should match returned issue issue_title');
            assert.equal(res.body[0].issue_text, data.issue_text, 'issue_text inserted should match returned issue issue_text');
            done();
          });
        });
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res){
          if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html', 'Response should be text');
          assert.equal(res.text, '_id error', 'Missing _id error should be returned');
          done();
        });
      });
      
      test('Valid _id', function(done) {
        Issue.find({ })
             .exec((err, data) => {
          chai.request(server)
          .delete('/api/issues/' + data.project)
          .send({ _id: data[0]._id })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html', 'Response should be text');
            assert.equal(res.text, 'deleted ' + data[0]._id, '_id of delete issue should be returned');
            done();
          });
        });
      });
      
    });

});

