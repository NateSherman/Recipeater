var express = require('express');
var mongoose = require('mongoose');
var users = require('./schemas/user');
const PORT = 8080
const HOST = '0.0.0.0'
const ConnectionString = "mongodb://mongo:27017/test"

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    let getAllUsersPromise = getAllUsers();
    dBWork(getAllUsersPromise).then((data) => {
        res.send(data);
    }).catch((err) =>{
        res.status(400).send(err);
    })
});

app.post('/', (req, res) => {
    let addUserPromise = addUser(req);
    dBWork(addUserPromise).then((data) => {
        res.send(data);
    }).catch((err) =>{
        res.status(400).send(err);
    });
})

app.listen(PORT, HOST);

function getAllUsers(){
    return new Promise((resolve, reject) => {
        users.find({}, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve(res);
        });
    })
}

function addUser(req){
    return new Promise((resolve, reject) => {
        if(!req.body.name || !req.body.email){
            reject('Invalid request');
        }
        users.find({email: req.body.email}, (err, found) =>{
            if(err) { reject(err); }
            if(found.length > 0){
                reject('User already exists');
            }else{
                var user1 = new users({ name: req.body.name, email: req.body.email });
                user1.save((err, data) => {
                    if (err){ reject(err); }
                    resolve(data);
                });
            }
        });
    });
}

function dBWork(doWork) {
    mongoose.connect(ConnectionString, { useNewUrlParser: true });
    return new Promise((resolve, reject) => {
        doWork.then((res) => {
            mongoose.disconnect();
            resolve(res);
        }).catch((err) =>{
            reject(err);
        });
    });

}