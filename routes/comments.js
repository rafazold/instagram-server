const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');

function commentsRoutes(app) {
    app
        .get('/api/posts/:postId/comments', (req, res) => {
            Comment
                .find({})
                .sort('-created')
                .limit(Number(req.query.limit || 20))
                .offset(Number(req.query.limit || 0))
                .then(list => res.json(list).end())
        })
        .post('/api/posts/:postId/comments', (req, res) => {
            const comment = new Comment(req.body);
            comment.user = req.user._id;

            comment
                .save()
                .then(comment => res.json(comment).end())
                .catch(err => res.status(400).json({message: "Comment not added"}).end())
        })
        //should the endpoint be /comments/ID or as it's below?
        .delete('/api/posts/:postId/:commentId', (req, res) => {
            Comment.findById(req.params.commentId)
                .then(comment => comment.remove())
                .then(comment => res.json(comment).end())
                .catch(() => res.status(400).end())

        })
        .put('/api/posts/:postId/:commentId', (req, res) => {
            Comment.findById(req.params.commentId)
                .then(comment => Object.assign(comment, req.body))
                .then(comment => comment.save())
                .then(comment => res.json(comment).end())
                .catch(err => {
                    console.error(err);
                    res.status(400).json({message: "Comment not edited"}).end()
                });
        })
}

//in .delete it's recommended to check the permission of the request after the findById

module.exports = commentsRoutes;