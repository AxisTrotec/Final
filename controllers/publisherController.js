var Publish = require('../models/publiser');
var Book = require('../models/book');
var async = require('async');
var mongoose = require('mongoose');


const { body,validationResult } = require("express-validator");


exports.publisher_list = function(req, res) {
    Publish.find()
      .sort([['name', 'ascending']])
      .exec(function (err, list_publisher) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('publisher_list', { title: 'Publisher List', publisher_list: list_publisher });
      });
};

exports.publisher_detail = function(req, res, next) {
    var id = mongoose.Types.ObjectId(req.params.id);
    async.parallel({
        name: function(callback) {
            Publish.findById(req.params.id)
              .exec(callback);
        },

        publisher_books: function(callback) {
            Book.find({ 'isbn': req.params.id })
            .exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.name==null) { // No results.
            var err = new Error('Publisher not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('publisher_detail', { title: 'Publisher Detail', publisher: results.name, publisher_books: results.publisher_books} );
    });

};

exports.publisher_create_get = function(req, res, next) {
    res.render('publisher_form', { title: 'Create Publisher' });
  };

exports.publisher_create_post =  [

    body('name', 'Publisher name required').trim().isLength({ min: 1 }).escape(),
  
    (req, res, next) => {
  
      const errors = validationResult(req);
  
      var publisher = new Publish(
        { name: req.body.name }
      );
  
      if (!errors.isEmpty()) {
        res.render('publisher_form', { title: 'Create Publisher', publisher: publisher, errors: errors.array()});
        return;
      }
      else {
        Publish.findOne({ 'name': req.body.name })
          .exec( function(err, found_publish) {
             if (err) { return next(err); }
  
             if (found_publish) {
               res.redirect(found_publish.url);
             }
             else {
  
               publisher.save(function (err) {
                 if (err) { return next(err); }
                 res.redirect(publisher.url);
               });
  
             }
  
           });
      }
    }
  ];