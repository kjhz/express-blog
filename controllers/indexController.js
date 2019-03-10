var Article = require("../models/article");
var Genre = require("../models/genre");
var User = require("../models/user");
var Comment = require("../models/comment");

var async = require("async");
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function (req, res) {
  Article.find({})
    .limit(5)
    .sort({ updated: -1 })
    .populate('genre')
    .exec(function (err, articles) {
      if (err) return next(err);
      res.render('index', {
        title: '梁福苹的个人博客',
        defaultTitle: true,
        article_list: articles
      });
    });
};

exports.search_get = [
  body('searchValue', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('searchValue').trim().escape(),
  (req, res, next) => {
    const page = +req.query.page || 1, //分页
      searchType = +req.query.searchType || 1, //默认从标题、标签、文章内容中搜索出结果
      searchValue = req.query.searchValue;
    const limit = 5; //每页显示的文章数量
    let search = new RegExp(searchValue, 'i');
    async.parallel({
      counts: function (callback) {
        switch (searchType) {
          case 1:
            Article.find({})
              .or([{ 'title': search }, { 'tag': search }, { 'text': search }])
              .count(callback);
            break;
          case 2: //仅从标题中搜索
            Article.find({ 'title': search })
              .count(callback);
            break;
          case 3:
            Article.find({ 'tag': search })
              .count(callback);
            break;
          default:
            break;
        }
      },
      articles: function (callback) {
        switch (searchType) {
          case 1:
            Article.find({})
              .or([{ 'title': search }, { 'tag': search }, { 'text': search }])
              .skip((page - 1) * limit)
              .limit(limit)
              .sort({ updated: -1 })
              .populate('genre')
              .exec(callback)
            break;
          case 2: //仅从标题中搜索
            Article.find({ 'title': search })
              .skip((page - 1) * limit)
              .limit(limit)
              .sort({ updated: -1 })
              .populate('genre')
              .exec(callback)
            break;
          case 3:
            Article.find({ 'tag': search })
              .skip((page - 1) * limit)
              .limit(limit)
              .sort({ updated: -1 })
              .populate('genre')
              .exec(callback)
            break;
          default:
            break;
        }

      }
    }, function (err, result) {
      if (err) return next(err);
      let count = Math.ceil(result.counts / limit);
      res.render('article_list', {
        title: `有关 ${searchValue} 的搜索结果`,
        article_list: result.articles,
        current: { url: `/search?searchType&searchValue=${searchValue}&`, name: `搜索 ${searchValue}` },
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

exports.tags = function (req, res) {
  Article.find({})
    .select('tag')
    .exec(function(err,data){
      let newData={};
      for (let i=0; i< data.length; i++) {
        let tags = data[i].tag;
        for (let j=0; j < tags.length; j++) {
          let tag = tags[j];
          newData[tag] ? ++newData[tag] : newData[tag] = 1;
        }
      }
      res.json(JSON.stringify(newData));
    })
}