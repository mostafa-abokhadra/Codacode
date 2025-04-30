class dashboardController {
    static async getDashboard(req, res) {
        console.log('user in dashboard', req.user)
        return res.render('dashboard', {user: req.user})
    }
}
module.exports = dashboardController