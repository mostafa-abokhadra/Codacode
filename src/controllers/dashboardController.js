class dashboardController {
    static async getDashboard(req, res) {
        res.render('dashboard', {user: req.user})
    }
}
module.exports = dashboardController