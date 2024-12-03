async function blockAuthenticatedUsers(req, res, next) {
    if (req.user)
        return res.status(401).json({"message": "user already logged in"})
    return next()
}
async function ensureAuthenticated (req, res, next) {
    if (!req.isAuthenticated())
        return res.status(403).json({ message: "Access forbidden: Authentication required" })
    return next()
}
function redirectToDashboardIfAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect(`/${req.user.fullName}/dashboard`)
    }
    return next()
}
module.exports = {
    blockAuthenticatedUsers,
    ensureAuthenticated,
    redirectToDashboardIfAuthenticated
}