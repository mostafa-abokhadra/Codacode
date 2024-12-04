const router = require('express').Router()
const projectPostController = require('../controllers/projectPostController')
const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated

// http://localhost:8080/mostafa abokhadra/project
router.post(
    '/:username/project',
    ensureAuthenticated,
    projectPostController.createProject

)

module.exports = router