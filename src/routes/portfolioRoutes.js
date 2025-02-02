const router = require('express').Router()
const {ensureAuthenticated} = require('../middlewares/checkSession')
const portfolioController = require('../controllers/portfolioController')

router.get(
    '/:username/portfolio',
    ensureAuthenticated,
    portfolioController.getPortfolio
)
module.exports = router