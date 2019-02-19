var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  user: { type: Schema.ObjectId, ref: "User"},
  date: { type: Date, default: Date.now },
  text: { type: String, required: true },
  article: { type: Schema.ObjectId, ref: "Article"}
});

CommentSchema
  .virtual('befor_present')
  .get(function() {
    return moment(this.date).fromNow;
  });

module.exports = mongoose.model("Comment", CommentSchema);