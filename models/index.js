// Retrieve
const MongoClient = require('mongodb').MongoClient;

let db;
let users;


function getUserByName(name) {
    return users.find({name}).toArray();
}

const mongoose = require('mongoose');
const {mongoUri} = require('../config');

mongoose
    .connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(() => process.exit(1));

require('./user');
require('./post');
require('./comment');


