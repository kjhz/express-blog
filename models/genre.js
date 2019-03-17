var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  article: { type: Schema.ObjectId, ref: 'Article' },
  name: { type: String, max: 20, required: true },
  nameCN: { type: String, max: 20},
  list: { type: Number, default: 0},
  weight: { type: Number, default: 0},
  fontawsome: { type: String}
});

GenreSchema
  .virtual('url')
  .get(function () {
    return "/genre/" + this.id;
  });

GenreSchema
  .virtual('filter_name')
  .get(function () {
    return this.name && this.nameCN;
  });
module.exports = mongoose.model('Genre', GenreSchema);