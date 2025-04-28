const router = require("express").Router()
const passport = require('../config/googleStrategy')
const passportGithub = require("../config/githubStrategy")

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
    '/check-email',
    authController.checkEmailAvailability
)
// router.post(
//     '/check-name',
//     authController.checkFullNameAvailability
// )

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
    passport.authenticate('google',  { scope: ['profile', 'email'] }),
    authController.getGoogleLogin
)
router.get(
    '/google/redirect',
    authController.redirectGoogle
);


router.get(
    "/github",
    passportGithub.authenticate('github', {scope: ["repo"]})
)
router.get(
    '/github/redirect',
    authController.getGitHubRedirect
)

router.post('/logout', ensureAuthenticated, authController.logout)

module.exports = router