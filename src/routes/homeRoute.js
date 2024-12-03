const router = require("express").Router()
const homeController = require('../controllers/homeController')
const redirectToDashboardIfAuthenticated = require("../middlewares/checkSession").redirectToDashboardIfAuthenticated

router.get('/', redirectToDashboardIfAuthenticated, homeController.getHome)

module.exports = router