var express = require('express');
var router = express.Router();


// Require controller modules.
var index_controller = require('../controllers/indexController');
var article_controller = require('../controllers/articleController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var user_controller = require('../controllers/userController');
var admin_controller = require('../controllers/adminController');

//主页
router.get('/', index_controller.index);

//登录和注销
router.get('/login', admin_controller.login_get);
router.post('/login', admin_controller.login_post);

router.get('/logout', admin_controller.logout_get);

/// GENRE ROUTES ///


router.get('/genre/create', genre_controller.genre_create_get);
router.post('/genre/create', genre_controller.genre_create_post);

router.get('/genre/:id/delete', genre_controller.genre_delete_get);

router.get('/genre/:id/delete', genre_controller.genre_delete_get);
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

router.get('/genre/:id', genre_controller.genre_article_list);

router.get('/genre', genre_controller.genre_list);



/// article ROUTES ///
router.get('/articles', article_controller.article_list);

router.get('/article/create', article_controller.article_create_get);

router.post('/article/create', article_controller.article_create_post);

router.get('/article/:id/delete', article_controller.article_delete_get);

router.post('/article/:id/delete', article_controller.article_delete_post);

router.get('/article/:id/update', article_controller.article_update_get);

router.post('/article/:id/update', article_controller.article_update_post);

router.get('/article/:id', article_controller.article_detail);



/// AUTHOR ROUTES ///
router.get('/author/create', author_controller.author_create_get);

router.post('/author/create', author_controller.author_create_post);

router.get('/author/:id/delete', author_controller.author_delete_get);

router.post('/author/:id/delete', author_controller.author_delete_post);

router.get('/author/:id/update', author_controller.author_update_get);

router.post('/author/:id/update', author_controller.author_update_post);

router.get('/author/:id', author_controller.author_detail);

router.get('/authors', author_controller.author_list);

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
