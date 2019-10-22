var mongoose = require('mongoose');
var commentSchema = new mongoose.Schema({
    user: String,
    text: String,
    relation: String
});
var Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;