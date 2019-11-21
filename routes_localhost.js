// Retrieve
const MongoClient = require('mongodb').MongoClient;

let db;
let users, punches;

// Connect to the models
MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true })
    .then(mongo => mongo.db('my-app'))
    .then(myAppDB => db = myAppDB)
    .then(() => {
        users = db.collection('users');
        punches = db.collection('punches')
    })
    .then(() => console.log('models is connected'))
    .catch(() => process.exit(1));


function getUserByEmail(email) {
    return users.find({email});
}

module.exports = {
    getUserByEmail
};