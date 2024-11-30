const router = require("express").Router()
const dashboardController = require('../controllers/dashboardController')

router.get('/dashboard', dashboardController.getDashboard)

module.exports = router