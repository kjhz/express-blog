var User = require("../models/user");

exports.user_list = function(req, res){
  res.send("user list");
};

exports.user_detail = function(req, res) {
  res.send("user detail");
};

exports.user_create_get = function(req, res) {
  res.send("暂未开发注册");
};

exports.user_create_post = function(req, res) {
  res.send("user create post");
};

exports.user_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: user delete GET');
};

exports.user_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: user delete POST');
};

exports.user_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: user update GET');
};

exports.user_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: user update POST');
};