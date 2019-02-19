var Article = require("../models/article");
var Author = require("../models/author");
var Genre = require("../models/genre");
var User = require("../models/user");
var ArticleInstance = require("../models/articleInstance");
var Comment = require("../models/comment");
var async = require("async");
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//上传图片文件
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage });

exports.index = function (req, res) {
  async.parallel({
    article_count: function (callback) {
      Article.countDocuments({}, callback);
    },
    article_instance_count: function (callback) {
      ArticleInstance.countDocuments({}, callback);
    },
    author_count: function (callback) {
      Author.countDocuments({}, callback);
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
      if (req.session.name) {
        res.render('index', { title: 'Home', error: err, data: results, userName: req.session.name });
      } else {
        res.render('index', { title: 'Home', error: err, data: results })
      }
    }
  });
};

exports.article_list = function (req, res, next) {
  let page = +req.query.page || 1;
  let limit = 3; //每页显示的文章数量
  if (req.query && req.query.genre) {
    Genre.findOne({ 'name': req.query.genre }, function (err, genre) {
      if (err) next(err);
      async.parallel({
        countDocuments: function (callback) {
          Article.countDocuments({ 'genre': genre.id }, callback);
        },
        articles: function (callback) {
          Article.find({ 'genre': genre.id })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ updated: -1 })
            .populate('author genre')
            .exec(callback)
        }
      }, function (err, results) {
        let count = Math.ceil(results.countDocuments / limit);
        res.render('article_list', {
          title: genre.filter_name,
          genre: genre,
          article_list: results.articles,
          count: count,
          page: page
        });
      });
    });
  } else {
    async.parallel({
      countDocuments: function (callback) {
        Article.countDocuments({}, callback);
      },
      articles: function (callback) {
        Article.find({})
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ updated: -1 })
          .populate('author genre')
          .exec(callback)
      }
    }, function (err, results) {
      let count = Math.ceil(results.countDocuments / limit);
      res.render('article_list', {
        title: '文章列表',
        current: { url: 'articles', name: '文章列表' },
        article_list: results.articles,
        count: count,
        page: page
      });
    });
  }
};

exports.article_detail = function (req, res, next) {
  Article.findOne({ _id: req.params.id })
    .populate('genre')
    .exec(function (err, article) {
      if (err) return next(err);
      article.views++;
      article.save();
      let title = `${article.title} - ${article.genre[0] && article.genre[0].filter_name || ''} - 梁福苹的个人博客`;
      res.render('article_detail', { title: title, genre: article.genre[0], current: { url: article.url, name: article.title }, article: article })
    })
};

exports.article_create_get = function (req, res, next) {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel({
    authors: function (callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    res.render('article_form', { title: '创建文章', authors: results.authors, genres: results.genres });
  });

};

exports.article_create_post = [
  //上传文件
  upload.single('img'),
  //把分类转换为数组
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('title').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var article = new Article({
      title: req.body.title,
      author: req.body.author,
      genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
      summary: req.body.summary,
      text: req.body.text,
      img: req.file
    });

    if (!errors.isEmpty()) {
      //含有错误，返回错误信息
      async.parallel({
        authors: function (callback) {
          Author.find(callback);
        },
        genres: function (callback) {
          Genre.find(callback);
        }
      }, function (err, results) {
        if (err) return next(err);

        for (let i = 0; i < results.genres.length; i++) {
          if (article.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('article_form', { title: '创建文章', authors: results.authors, genres: results.genres, article: article, errors: errors.array() });
      });
      return;
    } else {
      article.save(function (err) {
        if (err) { return next(err); }
        //successful - redirect to new book record.
        res.redirect(article.url);
      });
    }
  }
]

exports.article_delete_get = function (req, res, next) {
  Article.deleteOne({ _id: req.params.id }, function (err) {
    if (err) next(err);
    res.redirect('back');
  })
};

exports.article_delete_post = function (req, res) {
  res.send("article delete post");
};

exports.article_update_get = function (req, res, next) {
  async.parallel({
    article: function (callback) {
      Article.findById(req.params.id).populate('author').populate('genre').exec(callback);
    },
    authors: function (callback) {
      Author.find(callback);
    },
    genres: function (callback) {
      Genre.find(callback);
    },
  }, function (err, results) {
    if (err) return next(err);
    if (results.article == null) {
      var err = new Error('未找到该文章');
      err.status = 404;
      return next(err);
    }
    //成功
    //将分类标记为已勾选, 遍历 genres 和 article.genre，若配对，则标记
    for (var n = 0; n < results.genres.length; n++) {
      for (var a = 0; a < results.article.genre.length; a++) {
        if (results.genres[n]._id.toString() == results.article.genre[a]._id.toString()) {
          results.genres[n].checked = 'true';
        }
      }
    }
    res.render('article_form', { title: '更新文章', authors: results.authors, genres: results.genres, article: results.article });
  })

};


exports.article_update_post = [
  //上传文件
  upload.single('img'),
  //把分类转换为数组
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined')
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  sanitizeBody('title').trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var article = new Article({
      title: req.body.title,
      author: req.body.author,
      genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
      summary: req.body.summary,
      text: req.body.text,
      img: req.file,
      _id: req.params.id //这是必须的， 否则会创建新的ID
    });

    if (!errors.isEmpty()) {
      //含有错误，返回错误信息
      async.parallel({
        authors: function (callback) {
          Author.find(callback);
        },
        genres: function (callback) {
          Genre.find(callback);
        }
      }, function (err, results) {
        if (err) return next(err);
        //标记genre
        for (let i = 0; i < results.genres.length; i++) {
          if (article.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true';
          }
        }
        res.render('article_form', { title: '更新文章', authors: results.authors, genres: results.genres, article: article, errors: errors.array() });
      });
      return;
    } else {
      Article.findByIdAndUpdate(req.params.id, article, {}, function (err, article) {
        if (err) return next(err);
        // 更新成功，返回文章详情页
        res.redirect(article.url);
      })
    }
  }
]
