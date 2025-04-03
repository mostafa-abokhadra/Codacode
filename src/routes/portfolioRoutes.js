const router = require('express').Router()
const {ensureAuthenticated} = require('../middlewares/checkSession')
const portfolioController = require('../controllers/portfolioController')
const portfolioValidator = require('../validators/portfolioValidator')
const handleValidationError = require('../middlewares/validationErrorHandler')

// getting authenticated user portfolio
// getting userApplied to projects portfolio
router.get(
    '/:username/portfolio',
    ensureAuthenticated,
    portfolioController.getPortfolio
)

router.put(
    '/:username/portfolio/image',
    ensureAuthenticated,
    portfolioController.updatePortfolioImage,
)
// router.put(
//     '/portfolio/about',
//     ensureAuthenticated,
//     portfolioValidator.nameValidator,
//     portfolioValidator.taglineValidator,
//     portfolioValidator.aboutValidator,
//     handleValidationError,
//     portfolioController.updatePortfolioAbout
// )

module.exports = router