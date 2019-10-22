var express = require('express');
var mongoose = require('mongoose');
var comments = require('./schemas/comment');
const PORT = 8080
const HOST = '0.0.0.0'
const ConnectionString = "mongodb://comment_mongo:27017/recipeater"

const app = express();
app.use(express.json());

app.get('/comments/:relation', (req, res) => {
    let relation = req.params.relation;
    let getTopCommentsPromise = getTopComments(relation);
    dBWork(getTopCommentsPromise).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.get('/comment/:id', (req, res) => {
    let id = req.params.id;
    let getCommentPromise = getComment(id);
    dBWork(getCommentPromise).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.post('/comment', (req, res) => {
    let addCommentPromise = addComment(req);
    dBWork(addCommentPromise).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/cmt/comments/:anything', (req, res) => {
    res.send("Strip did not work");
});

app.listen(PORT, HOST);

function getTopComments(relation) {
    return new Promise((resolve, reject) => {
        comments.find({relation: relation}).limit(10).exec((err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

function getComment(id) {
    return new Promise((resolve, reject) => {
        comments.findOne({ _id: id }, (err, res) => {
            if (err) {
                reject(err);
            }
            if (res) {
                resolve(res);
            } else {
                reject("Comment not found");
            }
        });
    });
}

function addComment(req) {
    return new Promise((resolve, reject) => {
        if (!req.body.text || !req.body.relation) {
            reject('Invalid request');
        }
        let user = req.body.user ? req.body.user : 'anonymous';
        var newComment = new comments({ text: req.body.text, user: user, relation: req.body.relation });

        newComment.save((err, data) => {
            console.log('bueller');
            if (err) { reject(err); }
            console.log('data', data);
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
            reject(err.message);
        });
    });

}