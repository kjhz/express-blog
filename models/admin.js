var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AdminSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

AdminSchema
  .virtual('url')
  .get(function () {
    return "/admin/" + this._id;
  });

module.exports = mongoose.model('Admin', AdminSchema);