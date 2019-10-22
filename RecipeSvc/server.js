var express = require('express');
var mongoose = require('mongoose');
var recipes = require('./schemas/recipes');
const PORT = 8080
const HOST = '0.0.0.0'
const ConnectionString = "mongodb://recipe_mongo:27017/recipeater";

const app = express();
app.use(express.json());

app.get('/recipes', (req, res) => {
    let getTopRecipiesPromise = getTopRecipies();
    dBWork(getTopRecipiesPromise).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.get('/recipe/:id', (req, res) => {
    let id = req.params.id;
    let getRecipePromise = getRecipe(id);
    dBWork(getRecipePromise).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.get('/recipe', (req, res) => {
    let searchTerm = req.query.search;
    if (!searchTerm) {
        res.status(401).send("Not Found");
    }
    let searchRecipePromise = searchRecipe(searchTerm);
    dBWork(searchRecipePromise).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    });
})

app.post('/recipe', (req, res) => {
    let addRecipePromise = addRecipe(req);
    dBWork(addRecipePromise).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    });
})

app.listen(PORT, HOST);

function getTopRecipies() {
    return new Promise((resolve, reject) => {
        recipes.find({}).limit(5).exec((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

function getRecipe(id) {
    return new Promise((resolve, reject) => {
        recipes.findOne({ _id: id }, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res) {
                resolve(res);
            } else {
                reject("Recipe not found");
            }
        });
    });
}

function searchRecipe(searchTerm) {
    return new Promise((resolve, reject) => {
        var re = new RegExp(".*" + searchTerm + ".*", 'i')
        recipes.find({ title: re }, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    });
}

function addRecipe(req) {
    return new Promise((resolve, reject) => {
        if (!req.body.title || !req.body.instructions || !req.body.ingredients) {
            reject('Invalid request');
        }
        var newRecipe = new recipes({ title: req.body.title, instructions: req.body.instructions, ingredients:  req.body.ingredients });
        newRecipe.save((err, data) => {
            if (err) { reject(err); }
            resolve(data);
        });
    });
}

function dBWork(doWork) {
    mongoose.connect(ConnectionString, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        doWork.then((res) => {
            mongoose.disconnect();
            resolve(res);
        }).catch((err) => {
            reject(err);
        });
    });

}