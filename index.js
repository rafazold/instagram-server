const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const {port, jwtSecret} = require('./config');
const jwt = require('jsonwebtoken');

require("./models");

const app = express();

app.use(express.static('public'));
app.use(morgan('combined'));
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(function (req, res, next) {
    console.log('cookies:', req.cookies);
    if (req.cookies.user) {
        try {
            req.user = jwt.verify(req.cookies.user, jwtSecret).data;
        } catch(e) {
            res.cookie('user', '');
            res.status(403).json({message: 'user not authorized'}).end();
            return;
        }
    }
    next();
});


require('./routes/users')(app);
require('./routes/posts')(app);
require('./routes/comments')(app);


app.listen(port, () => console.log(`App listening on port ${port}!`));