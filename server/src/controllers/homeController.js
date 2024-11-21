class homeController {
    static async getHome(req, res) {
        res.render('home')
    }
}
module.exports = homeController