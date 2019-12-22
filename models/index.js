
const mongoose = require('mongoose');
const {mongoUri} = require('../config');

mongoose
    .connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true})
    .catch(() => process.exit(1));

require('./user');
require('./post');
require('./comment');


