var Article = require("../models/article");
var Genre = require("../models/genre");
var User = require("../models/user");
var Comment = require("../models/comment");

var async = require("async");
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function (req, res) {
  async.parallel({
    article_count: function (callback) {
      Article.countDocuments({}, callback);
    },
    genre_count: function (callback) {
      Genre.countDocuments({}, callback);
    },
    user_count: function (callback) {
      User.countDocuments({}, callback);
    },
    comment_count: function (callback) {
      Comment.countDocuments({}, callback);
    }, function(err, results) {
      
        res.render('index', { title: 'Home', error: err, data: results})

    }
  });
};

exports.search_get = [
  body('searchValue', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('searchValue').trim().escape(),
  (req, res, next) => {
    let page = +req.query.page || 1;
    let limit = 8; //每页显示的文章数量
    let searchValue = req.query.searchValue;
    let search = new RegExp(searchValue, 'i');
    async.parallel({
      counts: function (callback) {
        Article.find({})
          .or([{ 'title': search }, { 'tag': search }, { 'text': search }])
          .count(callback)
      },
      articles: function (callback) {
        Article.find({})
          .or([{ 'title': search }, { 'tag': search }, { 'text': search }])
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ updated: -1 })
          .populate('genre')
          .exec(callback)
      }
    }, function (err, result) {
      if (err) return next(err);
      let count = Math.ceil(result.counts / limit);
      res.render('article_list', {
        title: `有关 ${searchValue} 的搜索结果`,
        article_list: result.articles,
        current: { url: `/search?searchValue=${searchValue}&`, name: `搜索 ${searchValue}` },
        count: count,
        page: page,
      });
    });
  }
]


//json
exports.article_list_latest = function (req, res, next) {
  let limit = +req.query.limit || 10;
  Article.find({})
    .limit(limit)
    .select('updated title')
    .sort({ updated: -1 })
    .exec(function (err, results) {
      if (err) return next(err);
      res.json(results);
    });
}

exports.counts = function (req, res, next) {
  async.parallel({
    count_articles: function (callback) {
      Article.countDocuments(callback);
    },
    votes: function (callback) {
      Article.find()
        .select('meta.votes')
        .exec(callback)
    }
  }, function (err, results) {
    if (err) return next(err);
    let count_votes = results.votes.map(el => el.meta.votes)
      .reduce((a, b) => a + b, 0);
    res.json({
      article_count: results.count_articles,
      votes_count: count_votes
    });
  })
}