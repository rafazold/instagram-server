// Retrieve
const MongoClient = require('mongodb').MongoClient;

let db;
let users;




function getUserByName(name) {
    return users.find({name}).toArray();
}

// function connect() {
//     // Connect to the models
//     return MongoClient.connect("mongodb://heroku_mjrklbvl:6an38k795kgunjropt3673dhm@ds033579.mlab.com:33579/heroku_mjrklbvl", {useUnifiedTopology: true })
//         .then(mongo => mongo.db('heroku_mjrklbvl'))
//         .catch(() => process.exit(1));
// }

// module.exports = {connect};

// using mongoose

// oldcDB: "mongodb://heroku_mjrklbvl:6an38k795kgunjropt3673dhm@ds033579.mlab.com:33579/heroku_mjrklbvl"

const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || "mongodb://heroku_z5wx928q:qhmr0u73dlq875hrci3vintl2h@ds349618.mlab.com:49618/heroku_z5wx928q";

mongoose
    .connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(() => process.exit(1));

require('./user');
require('./post');
require('./comment');


