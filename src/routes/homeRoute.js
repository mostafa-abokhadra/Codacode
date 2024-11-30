const router = require("express").Router()
const homeController = require('../controllers/homeController')
const checkHomeOrDashboard = require("../middlewares/checkSession").checkHomeOrDashboard

router.get('/', checkHomeOrDashboard, homeController.getHome)

module.exports = router