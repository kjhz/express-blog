var Author = require("../models/author");

exports.author_list = function(req, res){
  res.send("author list");
};

exports.author_detail = function(req, res) {
  res.send("author detail");
};

exports.author_create_get = function(req, res) {
  res.send("author create get");
};

exports.author_create_post = function(req, res) {
  res.send("author create post");
};

exports.author_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

exports.author_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

exports.author_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

exports.author_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author update POST');
};