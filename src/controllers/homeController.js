class homeController {
    static async getHome(req, res) {
        return res.render('home')
    }
}
module.exports = homeController