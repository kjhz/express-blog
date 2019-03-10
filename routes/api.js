var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/indexController');
var article_controller = require('../controllers/articleController');
var genre_controller = require('../controllers/genreController');
var user_controller = require('../controllers/userController');
var admin_controller = require('../controllers/adminController');
var comment_controller = require('../controllers/commentController');

//获得articles的 updated 和 title 字段, 
//查询字符串 limit 
router.get('/article_list_latest', index_controller.article_list_latest);

//获取总数值， votes_count 和 article_count
router.get('/counts', index_controller.counts);

//获取使用较多的标签
router.get('/tags', index_controller.tags)

module.exports = router;
