var express = require('express');
var router = express.Router();


// Require controller modules.
var index_controller = require('../controllers/indexController');
var article_controller = require('../controllers/articleController');
var genre_controller = require('../controllers/genreController');
var user_controller = require('../controllers/userController');
var admin_controller = require('../controllers/adminController');
var comment_controller = require('../controllers/commentController');

router.all('*', index_controller.index_catalog)

//主页
router.get('/', index_controller.index);

router.get('/search', index_controller.search_get)

//登录和注销
router.get('/login', admin_controller.login_get);
router.post('/login', admin_controller.login_post);

router.get('/logout', admin_controller.logout_get);

//
router.get('/signin', user_controller.user_create_get);

/// GENRE ROUTES ///


router.get('/genre/create', genre_controller.genre_create_get);
router.post('/genre/create', genre_controller.genre_create_post);

router.get('/genre/:id/delete', genre_controller.genre_delete_get);

router.get('/genre/:id/delete', genre_controller.genre_delete_get);
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

router.get('/genre/:id/update', genre_controller.genre_update_get);
router.post('/genre/:id/update', genre_controller.genre_update_post);

router.get('/genre/:id', genre_controller.genre_detail);

router.get('/genre', genre_controller.genre_list);



/// article ROUTES ///
router.get('/articles', article_controller.article_list);

router.get('/article/create', article_controller.article_create_get);

router.post('/article/create', article_controller.article_create_post);

router.get('/article/:id/delete', article_controller.article_delete_get);

router.post('/article/:id/delete', article_controller.article_delete_post);

router.get('/article/:id/update', article_controller.article_update_get);

router.post('/article/:id/update', article_controller.article_update_post);

router.get('/article/:id/meta', article_controller.article_meta_get);

router.post('/article/:id/votes', article_controller.article_votes_post);

/// comments ///
router.get('/article/:id/comments', comment_controller.comment_list);

router.post('/article/:id/comment_create', comment_controller.comment_create_post)

router.get('/article/:id', article_controller.article_detail);


/// user router ///

router.get('/user/create', user_controller.user_create_get);

router.post('/user/create', user_controller.user_create_post);

router.get('/user/:id/delete', user_controller.user_delete_get);

router.post('/user/:id/delete', user_controller.user_delete_post);

router.get('/user/:id/update', user_controller.user_update_get);

router.post('/user/:id/update', user_controller.user_update_post);

router.get('/user/:id', user_controller.user_detail);

router.get('/users', user_controller.user_list);

module.exports = router;
