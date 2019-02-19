var Article = require("../models/article");
var Author = require("../models/author");
var Genre = require("../models/genre");
var User = require("../models/user");
var ArticleInstance = require("../models/articleInstance");
var Comment = require("../models/comment");

var async = require("async");

exports.index = function(req,res) {
  async.parallel({
    article_count: function(callback) {
      Article.countDocuments({}, callback);
    },
    article_instance_count: function(callback) {
      ArticleInstance.countDocuments({}, callback);
    },
    author_count: function(callback) {
      Author.countDocuments({}, callback);
    },
    genre_count: function(callback) {
      Genre.countDocuments({}, callback);
    },
    user_count: function(callback) {
      User.countDocuments({}, callback);
    },
    comment_count: function(callback) {
      Comment.countDocuments({}, callback);
    }, function(err, results) {
      if (req.session.name) {
        res.render('index', {title: 'Home', error: err, data: results, userName: req.session.name});
        console.log(req.session.name);
      } else {
        res.render('index', {title: 'Home', error: err, data: results})
      }
    }
  });
};

exports.nav_list = function(req,res,next) {
  
  next();
}