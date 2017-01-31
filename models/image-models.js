var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    title: String,
    height: Number,
    width: Number,
    caption: String,
    cloudinaryID: String,
    imageURL: String,
    description: String,
    camera_settings: String,
    created_at: Date

});

module.exports = mongoose.model('image', imageSchema);