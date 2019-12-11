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
        validate: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{2,}$/
    },
    birthDate: Date,
    avatarColor: String,
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