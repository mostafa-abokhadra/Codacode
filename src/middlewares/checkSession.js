async function blockAuthenticatedUsers(req, res, next) {
    if (req.user)
        return res.status(403).json({"message": "user already logged in"})
    return next()
}
async function ensureAuthenticated (req, res, next) {
    if (!req.isAuthenticated())
        return res.status(403).json({ message: "Access forbidden: Authentication required" })
    return next()
}
async function ensureValidUser(req, res, next) {
    if (req.user.id !== parseInt(req.params.user_id)) {
        console.log(req.user.id, parseInt(req.params.user_id))
        return res.status(403).json({"message": "session user disharmony"})
    }
    return next()
}
function redirectToDashboardIfAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        res.redirect(`/dashboard`)
    return next()
}
module.exports = {
    blockAuthenticatedUsers,
    ensureAuthenticated,
    redirectToDashboardIfAuthenticated,
    ensureValidUser
}