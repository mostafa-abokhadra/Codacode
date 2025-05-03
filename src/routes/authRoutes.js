const router = require("express").Router()
const passport = require('passport')

const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated
const blockAuthenticatedUsers = require('../middlewares/checkSession').blockAuthenticatedUsers

const authValidator = require('../validators/authValidator')
const handleValidationErrors = require('../middlewares/validationErrorHandler')

const authController = require("../controllers/authController")

router.get(
    '/signup',
    blockAuthenticatedUsers,
    authController.getSignup
)

router.post(
    '/signup',
    blockAuthenticatedUsers,
    authValidator.fullNameValidator,
    authValidator.emailValidator,
    authValidator.passwordValidator,
    handleValidationErrors,
    authController.postSignup
)

router.get(
    "/github",
    passport.authenticate('github', {
        scope: ["repo"],
    }),
)

router.get(
    '/github/redirect',
    authController.getGitHubRedirect
)

router.get(
    '/login',
    blockAuthenticatedUsers,
    authController.getLogin
)
router.post(
    '/login',
    blockAuthenticatedUsers,
    authController.postLogin
)

router.get(
    '/google',
    blockAuthenticatedUsers,
    authController.getGoogleLogin
)
router.get(
    '/google/redirect',
    authController.redirectGoogle
);


router.post('/logout', ensureAuthenticated, authController.logout)

////////
router.post(
    '/check-email',
    authController.checkEmailAvailability
)
module.exports = router