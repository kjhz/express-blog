var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema({
  name: { type: String, required: true, max: 20, trim: true },
  registrationDate: { type: Date, default: Date.now }
});

AuthorSchema
  .virtual('url')
  .get(function () {
    return '/author/' + this._id;
  });

AuthorSchema
  .virtual('date_formated')
  .get(function() {
    return moment(this.registrationDate).format('yy mm dd')
  });
  
module.exports = mongoose.model('Author', AuthorSchema);