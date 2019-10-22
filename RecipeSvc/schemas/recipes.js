var mongoose = require('mongoose');
var recipeSchema = new mongoose.Schema({
    title: String,
    instructions: String,
    ingredients: [{name: String, quantity: String, unitOfMeasure: String}]
});
var Recipe = mongoose.model('recipes', recipeSchema);

module.exports = Recipe;