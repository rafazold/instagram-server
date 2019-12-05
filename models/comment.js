const mongoose = require('mongoose');

mongoose.model('Comment', {
    content: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});