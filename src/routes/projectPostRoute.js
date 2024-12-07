const router = require('express').Router()

const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated

const postValidtor = require('../validators/postValidator')
const handleValidationError = require('../middlewares/validationErrorHandler')

const projectPostController = require('../controllers/projectPostController')


// http://localhost:8080/mostafa abokhadra/projects
// creating a new post
router.post(
    '/:username/projects',
    postValidtor.titleValidator,
    postValidtor.descriptionValidator,
    postValidtor.rolesValidator,
    postValidtor.repoUrlValidator,
    handleValidationError,
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