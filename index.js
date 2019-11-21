const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const {connect} = require("./models");


connect().then(db => {
    console.log('db is connected');
    const app = express();
    const port = 3000;

    app.use(morgan('combined'));
    app.use(cors());
    app.use(bodyParser.json());

    app.get('/api/users', (req, res) => {
       db.collection('users')
           .find({})
           .toArray()
           .then(list => res.json(list).end())
    });

    app.listen(port, () => console.log(`App listening on port ${port}!`));

});

