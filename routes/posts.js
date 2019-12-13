const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/');
    },
    filename: function (req, file, cb) {
        const nameArr = file.originalname.split('.');
        const extension = nameArr[nameArr.length - 1];
        const randomName = Math.random().toString(36).substring(7);
        cb(null, randomName + '.' + extension);
    }
});
const upload = multer({ storage: storage });
const authorize = require('../helpers/authorize');
//TODO: add authorize to all needed endpoints

function postsRoutes(app) {
    app
        .get('/api/posts', (req, res) => {
        Post
            .find({})
            .sort('-created')
            .limit(Number(req.query.limit || 20))
            .skip(Number(req.query.limit || 0))
            .populate('user', 'username avatar')
            .then(list => res.json(list).end())
            .catch(err => res.status(400).json({mesage: "can't fetch posts"}).end())
    })
        .post('/api/posts', authorize, upload.single('image'), (req, res) => {
            const post = new Post(req.body);

            post.image = req.file.filename;
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
            const status = req.body.status || false; //status should be true or false(state in front)
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
                        status: status
                    }).end();
                })
                .catch(() => res.status(400).end())
        })

}

//in .delete it's recommended to check the permission of the request after the findById

module.exports = postsRoutes;