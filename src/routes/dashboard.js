const router = require("express").Router()
const dashboardController = require('../controllers/dashboardController')

router.get('/:username/dashboard', dashboardController.getDashboard)

module.exports = router