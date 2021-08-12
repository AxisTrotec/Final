var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PublisherSchema = new Schema(
  {
    name: {type: String, required: true, minLength: 10, maxLength: 60},
  }
);

PublisherSchema
.virtual('url')
.get(function () {
  return '/catalog/publisher/' + this._id;
});

module.exports = mongoose.model('Publisher', PublisherSchema);