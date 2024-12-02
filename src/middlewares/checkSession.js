async function checkAuthenticated(req, res, next) {
    if (req.user)
        return res.status(401).json({"message": "user already logged in"})
    next()
}
async function checkSession(req, res, next) {
    if (!req.isAuthenticated())
        return res.status(401).json({"message": "unAuthorized"})
    next()
}
async function checkHomeOrDashboard(req, res, next) {
    if (req.isAuthenticated())
        res.redirect(`/${req.user.fullName}/dashboard`)
    next()
}
module.exports = {
    checkAuthenticated,
    checkSession,
    checkHomeOrDashboard
}