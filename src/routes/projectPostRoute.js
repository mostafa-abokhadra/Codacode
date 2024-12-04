const router = require('express').Router()
const projectPostController = require('../controllers/projectPostController')
const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated

// http://localhost:8080/mostafa abokhadra/projects
router.post(
    '/:username/projects',
    ensureAuthenticated,
    projectPostController.createPost

)

//http://localhost:8080/mostafa abokhadra/projects
router.get('/:username/projects',
    ensureAuthenticated,
    projectPostController.getPosts
)

// http://localhost:8080/mostafa abokhadra/projects/3
router.get(
    "/:username/projects/:projectId",
    ensureAuthenticated,
    projectPostController.getPostById
)

// http://localhost:8080/mostafa abokhadra/projects/3
router.put(
    '/:username/projects/:projectId',
    ensureAuthenticated,
    projectPostController.updatePost
)

// http://localhost:8080/mostafa abokhadra/projects/3
router.delete(
    '/:username/projects/:projectId',
    ensureAuthenticated,
    projectPostController.deletePost
)

module.exports = router