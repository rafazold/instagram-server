const mongoose = require('mongoose');

mongoose.model('Post', {
    title: {
        type: String,
        require: true
    },
    image: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref:'User'
    },
    tags: [String],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref:'User'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});
