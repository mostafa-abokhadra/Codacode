class errorsController {
    static async getServerError(req, res) {
        return res.render('serverError')
    }
}

module.exports = errorsController