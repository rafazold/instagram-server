const MongoClient = require('mongodb').MongoClient;

let db;
let users;

// Connect to the db server:
MongoClient.connect("mongodb://heroku_mjrklbvl:6an38k795kgunjropt3673dhm@ds033579.mlab.com:33579/heroku_mjrklbvl", {useUnifiedTopology: true})
// connect to specific db inside server
    .then(mongo => mongo.db('heroku_mjrklbvl'))
    // store the db connection to "db" variable
    .then(givenDB => db = givenDB)
    .then(() => {
        // store our collections into variables
        users = db.collection('users');
    })
    .then(() => console.log('db is connected!'))
    // close the app in case something is not working
    .catch(() => process.exit(1));


function getUserByName(name) {
    return users.find({name}).toArray();
}

module.exports = {
    getUserByName
};