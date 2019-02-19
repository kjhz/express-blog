var mongoose = require('mongoose');
var marked = require('marked'); 
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});

var blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  tag: { type: [String], index: true},
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  },
  views: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at' } });

blogSchema.methods.findSimilarAuthor = function (cb) {
  return this.model('Blog').find({ author: this.author }, cb);
};

blogSchema.statics.findByTitle = function(title, cb) {
  return this.find({ title: new RegExp(title, 'i') }, cb);
};

blogSchema.query.byBody = function(text) {
	return this.where({ body: new RegExp(text, 'i') });
};

blogSchema
  .virtual('marked_body')
  .get(function () {
    return marked(this.body);
  });

module.exports = mongoose.model('Blog', blogSchema);