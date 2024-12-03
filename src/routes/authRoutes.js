const router = require("express").Router()
const passport = require('../config/googleStrategy')

const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated
const blockAuthenticatedUsers = require('../middlewares/checkSession').blockAuthenticatedUsers

const authController = require("../controllers/authController")

router.get('/signup', blockAuthenticatedUsers, authController.getSignup)
router.post('/signup', blockAuthenticatedUsers, authController.postSignup)

router.get('/login', blockAuthenticatedUsers, authController.getLogin)
router.post('/login', blockAuthenticatedUsers, authController.postLogin)

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

router.post('/logout', ensureAuthenticated, authController.logout)

module.exports = router