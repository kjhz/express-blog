var Article = require("../models/article");
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
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage });

exports.article_list = function (req, res, next) {
  let page = +req.query.page || 1;
  let limit = 5; //每页显示的文章数量
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
            .populate('genre')
            .exec(callback)
        }
      }, function (err, result) {
        if (err) return next(err);
        let count = Math.ceil(result.countDocuments / limit);
        res.render('article_list', {
          title: genre.filter_name,
          genre: genre,
          article_list: result.articles,
          count: count,
          page: page,
          showNav: true
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
          .populate('genre')
          .exec(callback)
      }
    }, function (err, result) {
      let count = Math.ceil(result.countDocuments / limit);

      res.render('article_list', {
        title: '文章列表',
        current: { url: '/articles?', name: '文章列表' },
        article_list: result.articles,
        count: count,
        page: page,
        showNav: true
      });
    });
  }
};

exports.article_detail = function (req, res, next) {
  let nickname = req.session.nickname;
  Article.findOne({ _id: req.params.id })
    .populate('genre')
    .exec(function (err, article) {
      if (err) return next(err);
      article.views++;
      article.save();
      let title = `${article.title} - ${article.genre[0] && article.genre[0].filter_name || ''} - 梁福苹的个人博客`;

      res.render('article_detail', {
        title: title,
        genre: article.genre[0],
        current: { url: article.url, name: article.title },
        article: article,
        nickname: nickname,
        showNav: true
      })
    })
};

exports.article_create_get = function (req, res, next) {
  Genre.find()
    .exec(function (err, genres) {
      if (err) { return next(err); }
      res.render('article_form', { title: '创建文章', genres: genres });
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
    let tag = req.body.tag.filter(a => a); //去除数组空元素
    var article = new Article({
      title: req.body.title,
      author: req.body.author,
      genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
      summary: req.body.summary,
      text: req.body.text,
      img: req.file,
      tag: tag
    });

    if (!errors.isEmpty()) {
      //含有错误，返回错误信息
      genre.find()
        .exec(function (err, genres) {
          if (err) return next(err);

          for (let i = 0; i < results.genres.length; i++) {
            if (article.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          }
          res.render('article_form', { title: '创建文章', genres: genres, article: article, errors: errors.array() });
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
      Article.findById(req.params.id).populate('genre').exec(callback);
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
    res.render('article_form', {
      title: '更新文章',
      genres: results.genres,
      article: results.article
    });
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
    //取回原先的数据
    Article.findById(req.params.id)
      .select('img comments meta views')
      .exec(function (err, article) {
        if (err) return next(err);
        req.body.img = article.img;
        req.body.comments = article.comments,
        req.body.meta = article.meta,
        req.body.views = article.views;
        next();
      })
  }
  ,
  (req, res, next) => {
    const errors = validationResult(req);
    let tag = req.body.tag.filter(a => a); //去除数组空元素
    var article = new Article({
      title: req.body.title,
      author: req.body.author,
      genre: (typeof req.body.genre === 'undefined') ? [] : req.body.genre,
      summary: req.body.summary,
      text: req.body.text,
      img: req.file || req.body.img,
      tag: tag,
      comments: req.body.comments,
      meta: req.body.meta,
      views: req.body.views,
      _id: req.params.id //这是必须的， 否则会创建新的ID
    });

    if (!errors.isEmpty()) {
      //含有错误，返回错误信息
      Genre.find()
        .exec(function (err, genres) {
          if (err) return next(err);
          //标记genre
          for (let i = 0; i < results.genres.length; i++) {
            if (article.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }
          }
          res.render('article_form', {
            title: '更新文章',
            genres: genres,
            article: article,
            errors: errors.array()
          });
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

//meta,用于ajax调用
exports.article_meta_get = function (req, res, next) {
  Article.findById(req.params.id)
    .select('meta')
    .exec(function (err, article) {
      if (err) return next(err);
      res.json(article.meta);
    })
}

exports.article_votes_post = function (req, res, next) {
  Article.findById(req.params.id)
    .select('meta')
    .exec(function (err, article) {
      if (err) return next(err);
      if (!article.meta.votes) {
        article.meta.votes = 0;
      }
      article.meta.votes++;
      article.save(function (err) {
        if (err) return next(err);
        res.sendStatus(200);
      })
    })
}
