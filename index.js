const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// const {connect} = require("./models"); changed with:
require("./models");
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');


// connect().then(db => {
//     console.log('db is connected');
// });


const app = express();
const port = 4000;

app.use(express.static('public'));
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());

//for password validation:

app.use(function (req, res, next) {
    const User = mongoose.model('User');

    User.findOne({
        user: req.headers.user,
        password: req.headers.password
    })
        .then(user => req.user = user)
        .then(() => next())
        .catch(() => res.status(400).end());
});


require('./routes/users')(app);
require('./routes/posts')(app);


app.listen(port, () => console.log(`App listening on port ${port}!`));
