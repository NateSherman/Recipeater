var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name: String,
    email: String
});
var User = mongoose.model('users', userSchema);

module.exports = User;