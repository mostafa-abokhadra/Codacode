const router = require("express").Router()

const checkSession = require('../middlewares/checkSession').checkSession
const checkAuthenticated = require('../middlewares/checkSession').checkAuthenticated

const authController = require("../controllers/authController")

router.get('/signup', checkAuthenticated, authController.getSignup)
router.post('/signup', checkAuthenticated, authController.postSignup)

router.get('/login', checkAuthenticated, authController.getLogin)
router.post('/login', checkAuthenticated, authController.postLogin)
router.post('/logout', checkSession, authController.logout)

module.exports = router