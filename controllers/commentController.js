var Comment = require("../models/comment");
var Article = require('../models/article');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.comment_list = function (req, res, next) {
    Article.findById(req.params.id)
        .select('comments')
        .exec(function (err, article) {
            if (err) return next(err);
            article.comments.sort(function(a, b) {
                if (a.date < b.date) return 1;
                return -1;
            });
            let data = article.comments.slice(0,5);
            
            res.json(data);
        })
};

exports.comment_detail = function (req, res) {
    res.send('NOT IMPLEMENTED: comment detail: ' + req.params.id);
};

exports.comment_create_get = function (req, res) {
    res.send('NOT IMPLEMENTED: comment create GET');
};

exports.comment_create_post = [
    body('comment', 'comment must not be empty.').isLength({ min: 1 }).trim(),
    body('nickname', 'nickname must not be empty.').isLength({ min: 1 }).trim(),
    sanitizeBody('comment nickname').trim().escape(),
    (req, res, next) => {
        const erors = validationResult(req);

        req.session.nickname = req.body.nickname;  //暂存昵称到session

        Article.findById(req.params.id, function (err, article) {
            if (err) return next(err);
            article.comments.push({
                comment: req.body.comment,
                nickname: req.body.nickname
            });
            article.save(function(err){
                res.sendStatus(200);
            });
        })
        
    }
];

exports.comment_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: comment delete GET');
};

exports.comment_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: comment delete POST');
};

exports.comment_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: comment update GET');
};

exports.comment_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: comment update POST');
};