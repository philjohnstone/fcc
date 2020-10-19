/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

module.exports = function (app) {

  var Issue = require('../storage.js').Issue;
  var createAndSaveIssue = require('../storage.js').createAndSaveIssue;
  var findAndUpdateIssue = require('../storage.js').findAndUpdateIssue;

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var query = {
        project: req.params.project
      };
      if (req.query.issue_title) query.issue_title = req.query.issue_title;
      if (req.query.issue_text) query.issue_text = req.query.issue_text;
      if (req.query.created_by) query.created_by = req.query.created_by;
      if (req.query.assigned_to) query.assigned_to = req.query.assigned_to;
      if (req.query.status_text) query.status_text = req.query.status_text;
      if (typeof req.query.open !== 'undefined') update.open = req.query.open;
      Issue.find(query)
           .exec((err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.json(data);
          }
        });
    })
    
    .post(function (req, res){
      if (!(req.body.issue_title && req.body.issue_text && req.body.created_by)) {
        res.send('One or more mandatory fields (title, text, created by) are missing');
      } else {
        createAndSaveIssue({
          project: req.params.project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to ? req.body.assigned_to : '',
          status_text: req.body.status_text ? req.body.status_text : ''
        }, (err, data) => {
          if (err) {
            res.send(err);
          } else {
            res.json(data);
          }
        });
      }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      var id = req.body._id;
      var update = { };
      if (req.body.issue_title) update.issue_title = req.body.issue_title;
      if (req.body.issue_text) update.issue_text = req.body.issue_text;
      if (req.body.created_by) update.created_by = req.body.created_by;
      if (req.body.assigned_to) update.assigned_to = req.body.assigned_to;
      if (req.body.status_text) update.status_text = req.body.status_text;
      if (typeof req.body.open !== 'undefined') update.open = req.body.open;
      if (Object.keys(update).length == 0) {
        res.send('no updated field sent');
      } else {
        update.updated_on = new Date();
        findAndUpdateIssue(id, update, (err, data) => {
          if (err) {
            res.send('could not update ' + id);
          } else {
            res.send('successfully updated');
          }
        });
      }
    })
    
    .delete(function (req, res){
      if (!req.body._id) {
        res.send('_id error');
      } else {
        Issue.deleteOne({ _id: req.body._id }, (err, data) => {
          if (err || data.ok != 1) {
            res.send('could not delete ' + req.body._id);
          } else {
            res.send('deleted ' + req.body._id);
          }
        });
      }
    });
    
};

