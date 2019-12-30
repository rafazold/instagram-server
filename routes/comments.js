const mongoose = require('mongoose');
const Comment = mongoose.model('Comment');

function commentsRoutes(app) {
    app
        .get('/api/posts/:postId/comments', (req, res) => {
            console.log('HERE WE GO!!!');
            Comment
                .aggregate([
                    { $match : { post: mongoose.Types.ObjectId(req.params.postId) } },
                    {
                        $lookup: {
                            from: 'users',
                            let: {user: "$user"},
                            pipeline: [
                                {$match: {$expr: {$eq: ["$_id", "$$user"]}}},
                                {$project: {username: 1, avatar: 1}}
                            ],
                            as: 'user',
                        },

                    },
                ])
                .sort('-created')
                // .populate('user')
                .then(list => res.json(list).end())
                .catch(err => res.status(400).json({message: err}).end())
        })
        .post('/api/posts/:postId/comments', (req, res) => {
            const comment = new Comment(req.body);
            console.log(req.body);
            comment.user = req.user;
            comment.post = req.params.postId;
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
        .put('/api/posts/:postId/:commentid', (req, res) => {
            Comment.findById(req.params.commentid)
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