const router = require("express").Router()
const passport = require('../config/googleStrategy')

const checkSession = require('../middlewares/checkSession').checkSession
const checkAuthenticated = require('../middlewares/checkSession').checkAuthenticated

const authController = require("../controllers/authController")

router.get('/signup', checkAuthenticated, authController.getSignup)
router.post('/signup', checkAuthenticated, authController.postSignup)

router.get('/login', checkAuthenticated, authController.getLogin)
router.post('/login', checkAuthenticated, authController.postLogin)

router.get(
    '/google',
    passport.authenticate('google',  { scope: ['profile', 'email'] }),
    authController.getGoogleLogin
)
router.get(
    '/google/redirect',
    authController.redirectGoogle
);

router.post('/logout', checkSession, authController.logout)

module.exports = router