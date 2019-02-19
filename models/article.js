var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;
var marked = require('marked');

var ArticleSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: "Author", required: true },
  genre: [{ type: Schema.ObjectId, ref: "Genre", default: null }],
  text: { type: String, require: true },
  updated: { type: Date, default: Date.now },
  img: {
    type: Schema.Types.Mixed,
    default: {
      originalname: 'default image',
      filename: 'images/monkey_box1.png'
    }
  },
  views: {type:Number,default: 0}
});

ArticleSchema
  .virtual('url')
  .get(function () {
    return '/article/' + this._id;
  });

ArticleSchema
  .virtual('before_present')
  .get(function () {
    return moment(this.updated).fromNow();
  });

ArticleSchema
  .virtual('format_updated')
  .get(function () {
    return moment(this.updated).format('YYYY-MM-DD');
  });

ArticleSchema
  .virtual('format_updated_CN')
  .get(function () {
    return moment(this.updated).format('YYYY年MM月DD日');
  });

ArticleSchema
  .virtual('marked_text')
  .get(function () {
    return marked(this.text);
  });

ArticleSchema
  .virtual('beginning_preview')
  .get(function () {
    return this.text.slice(0, 150)+ '......';
  });

module.exports = mongoose.model("Article", ArticleSchema);