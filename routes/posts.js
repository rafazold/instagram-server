const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const multer = require('multer');
const multerGoogleStorage = require("multer-google-storage");

const uploadHandler = multer({
    storage: multerGoogleStorage.storageEngine({
        contentType: (req, file) => file.mimetype,
        filename: function (req, file, cb) {
            const nameArr = file.originalname.split('.');
            const extension = nameArr[nameArr.length - 1];
            const randomName = Math.random().toString(36).substring(7);
            cb(null, randomName + '.' + extension);
        }
    })
});
const authorize = require('../helpers/authorize');

function postsRoutes(app) {
    app
        .get('/api/posts', (req, res) => {
        Post
            .find({})
            .sort('-created')
            .limit(Number(req.query.limit || 20))
            .skip(Number(req.query.limit || 0))
            .populate('user', 'username avatar')
            .lean()
            .then(list => {
                const postsList = list.map(post => ({...post, isLiked: post.likes.some(like => like.equals(req.user))}));
                    res.json(postsList).end()
            })
            .catch(err => res.status(400).json({message: "can't fetch posts"}).end())
    })
        .post('/api/posts', authorize, uploadHandler.single('image'), (req, res) => {
            const post = new Post(req.body);

            post.image = req.file.path;
            post.user = req.user;
            post.save()
                .then(post => res.json(post).end())
                .catch(err => res.status(400).json({message: "Post not added", error: err}).end())
        })
        .get('/api/posts/:postId', (req, res) => {
            Post.findById(req.params.postId)
                .then(post => res.json(post).end())
                .catch(() => res.status(400).end())

        })
        .delete('/api/posts/:postId', authorize, (req, res) => {
            Post.findById(req.params.postId)
                .then(post => post.remove())
                .then(post => res.json(post).end())
                .catch(() => res.status(400).end())

        })
        .put('/api/posts/:postId', authorize, (req, res) => {
            Post.findById(req.params.postId)
                .then(post => Object.assign(post, req.body))
                .then(post => post.save())
                .then(post => res.json(post).end())
                .catch(err => {
                    console.error(err);
                    res.status(400).json({message: "Post not added"}).end()
                });
        })
        .post('/api/posts/:postId/like', authorize, (req, res) => {
            const user = req.user;
            const status = req.body.likeStatus || false; //status should be true or false(state in front)
            Post.findById(req.params.postId)
                .then(post => {
                    post.likes = post.likes.filter(like => !like.equals(user));
                    if (status) {
                        post.likes.push(user);
                    }
                    return post.save();
                })
                .then(() => {
                    res.status(200).json({
                        likeStatus: status
                    }).end();
                })
                .catch(() => res.status(400).end())
        })

}

//in .delete it's recommended to check the permission of the request after the findById

module.exports = postsRoutes;