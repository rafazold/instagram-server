const mongoose = require('mongoose');
const multer = require('multer');
const multerGoogleStorage = require("multer-google-storage");

const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
const {jwtSecret, keyFilename, projectId, bucket} = require('../config');

const authorize = require('../helpers/authorize');
const uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        contentType: (req, file) => file.mimetype,
        filename: function (req, file, cb) {
            const nameArr = file.originalname.split('.');
            const extension = nameArr[nameArr.length - 1];
            const randomName = Math.random().toString(36).substring(7);
            cb(null, randomName + '.' + extension);
        },
        keyFilename: keyFilename,
        projectId: projectId,
        bucket: bucket

    })
});


function usersRoutes(app) {
    app
        .get('/api/users', (req, res) => {
        User
            .find({})
            .then(list => res.json(list).end())
    })
        .post('/api/users', uploadHandler.single('avatar'),(req, res) => {
            const user = new User(req.body);
            user.avatar = req.file.path;
            user.save()
                .then(user => {
                    const token = jwt.sign({data: user._id}, jwtSecret, {expiresIn: '7d'});
                    res.cookie('user', token, { expires: new Date(Date.now() + 900000000) });
                    res.json(user).end()
                })
                .catch(err => res.status(400).json({message: "User not added", err: err}).end())
        })
        .get('/api/users/me', (req, res) => {
            User.findById(req.user)
                .select('name username birthDate gender about avatar')
                .then(user => res.json(user));
        })
        .get('/api/users/logout', (req, res) => {
            res.cookie('user', '');
            res.status(200).json({message: 'logged out'});
            res.end();
        })
        .get('/api/users/:userId', (req, res) => {
            User.findById(req.params.userId)
                .select('name username birthDate gender about')
                .then(user => res.json(user).end())
                .catch(() => res.status(400).end())

        })
        .delete('/api/users/:userId', authorize, (req, res) => {
            User.findById(req.params.userId)
                .then(user => user.remove())
                .then(user => res.json(user).end())
                .catch(() => res.status(400).end())

        })
        .put('/api/users/:userId', authorize, uploadHandler.single('avatar'), (req, res) => {
            req.body.avatar = req.file.path;
            User.findById(req.params.userId)
                .then(user => Object.assign(user, req.body))
                .then(user => user.save())
                .then(user => res.json(user).end())
                .catch(err => {
                    console.error(err);
                    res.status(400).json({message: "User not added"}).end()
                });
        })
        .post('/api/users/login', (req, res) => {
           User
               .findOne({
                   username: req.body.username,
                   password: req.body.password
               })
               .then(user => {
                   if(!user) {
                       console.log('no user');
                       res.status(403).end();
                       return;
                   }
                   //TODO: add this to register.
                   const token = jwt.sign({data: user._id}, jwtSecret, {expiresIn: '7d'});
                   res.cookie('user', token, { expires: new Date(Date.now() + 900000000) });
                   res.end();
               })
               .catch(err => res.status(400).send(err));
        })

}

//in .delete it's recommended to check the permission of the request after the findById

module.exports = usersRoutes;