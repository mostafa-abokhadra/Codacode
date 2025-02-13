const router = require('express').Router()
const {ensureAuthenticated} = require('../middlewares/checkSession')
const portfolioController = require('../controllers/portfolioController')

// getting authenticated user portfolio
// getting userApplied to projects portfolio
router.get(
    '/:username/portfolio',
    ensureAuthenticated,
    portfolioController.getPortfolio
)
router.put(
    '/portfolio/about',
    ensureAuthenticated,
    portfolioController.updatePortfolioAbout
)
module.exports = router