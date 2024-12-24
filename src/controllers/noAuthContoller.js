
class noAuthController {
    static async getIdeas(req, res) {
        try {
            return res.render('ideasBank')
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async getUserPortofolio(req, res) {
        try {
            return res.render('portofolio')
        } catch(error) {
            console.log(error)
            return res.status(500).json({"meessage": "an error has occurd"})
        }
    }
}
module.exports = noAuthController
