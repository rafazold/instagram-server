function authorize(req, res, next) {
    if(!req.user) {
        return res.status(403).json({message: "user not authorized"}).end()
    }
    next();
}

module.exports = authorize;