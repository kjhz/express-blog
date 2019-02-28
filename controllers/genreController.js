const Genre = require('../models/genre');
const Article = require('../models/article');
const async = require('async');
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.genre_list = function (req, res, next) {
    Genre.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_genre) {
            if (err) return next(err);
            res.render('list', { title: '分类列表', data: list_genre });
        })
};

exports.genre_article_list = function (req, res, next) {
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id)
                .exec(callback);
        },
        articles: function (callback) {
            Article.find({ 'genre': req.params.id })
                .populate('genre')
                .exec(callback);
        }
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.genre == null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('article_list', { 
            title: results.genre.filter_name,
            genre: results.genre,
            article_list: results.articles
        });
    });
};

exports.genre_create_get = function (req, res) {
    res.render('genre_form', { title: "创建种类" });
};

exports.genre_create_post = [
    body('name', '请输入种类名').isLength({ min: 1 }).trim(),
    sanitizeBody('name nameCN').trim().escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(req.body.name);
        var genre = new Genre({
            name: req.body.name,
            nameCN: req.body.nameCN

        });
        if (!errors.isEmpty()) {
            //含有错误，重新渲染表格并输出错误消息
            res.render('genre_form', { title: '创建种类', genre: genre, errors: errors.array() });
            return;
        } else {
            //检查种类名是否已存在
            Genre.findOne({ 'name': req.body.name })
                .exec(function (err, found_genre) {
                    if (err) return next(err);
                    if (found_genre) {
                        //已存在种类名
                        res.render('genre_form', { title: '创建种类', genre: genre, confirm: "种类名已存在" });
                    } else {
                        genre.save(function (err) {
                            if (err) return next(err);
                            res.render('genre_form', { title: '创建种类', confirm: '创建成功' });
                        });
                    }
                });
        }
    }
];

exports.genre_delete_get = function (req, res, next) {
    Genre.deleteOne({ '_id': req.params.id }, function (err) {
        if (err) next(err);
        res.send('删除成功');
    })
};

exports.genre_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

exports.genre_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

exports.genre_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};