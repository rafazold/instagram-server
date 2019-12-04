const mongoose = require('mongoose');

mongoose.model('User', {
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            return value.length > 4;
        }
    },
    password: {
        type: String,
        validate: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
    },
    birthDate: Date,
    gender: {
        type: String,
        enum: ['f', 'm']
    },
    githubLink: String,
    about: String,
    created: {
        type: Date,
        default: Date.now
    }
});