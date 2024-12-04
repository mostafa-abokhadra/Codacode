const router = require('express').Router()
const projectPostController = require('../controllers/projectPostController')
const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated

// http://localhost:8080/mostafa abokhadra/project
router.post(
    '/:username/projects',
    ensureAuthenticated,
    projectPostController.createPost

)

router.get('/:username/projects',
    ensureAuthenticated,
    projectPostController.getPosts
)

router.get(
    "/:username/projects/:projectId",
    ensureAuthenticated,
    projectPostController.getPostById
)

router.put(
    '/:username/projects/:projectId',
    ensureAuthenticated,
    projectPostController.updatePost
)
module.exports = router