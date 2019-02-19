var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleInstanceSchema = new Schema({
  article: { type: Schema.ObjectId, ref: "Article", required: true},
  imprint: { type: String, required: true },
  label: [{type: String}],
  comment: [{ type: Schema.ObjectId, ref: "Comment"}]
});

module.exports = mongoose.model('ArticleInstance', ArticleInstanceSchema);