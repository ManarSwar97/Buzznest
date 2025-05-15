const passUserToView = (req, res, next) => {
    //if there's a user in the session then assign it
    res.locals.user = req.session.user ? req.session.user
    : null
    //go to the next instruction
    next()
}
module.exports = passUserToView 