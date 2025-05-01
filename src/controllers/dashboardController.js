class dashboardController {
    static async getDashboard(req, res) {
        return res.render('dashboard', {user: req.user})
    }
}
module.exports = dashboardController