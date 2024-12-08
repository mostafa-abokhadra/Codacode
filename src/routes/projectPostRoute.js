const router = require('express').Router()

const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated

const postValidtor = require('../validators/postValidator')
const handleValidationError = require('../middlewares/validationErrorHandler')

const projectPostController = require('../controllers/projectPostController')


// http://localhost:8080/mostafa abokhadra/projects
// creating a new post
router.post(
    '/:username/projects',
    ensureAuthenticated,
    postValidtor.titleValidator,
    postValidtor.descriptionValidator,
    postValidtor.rolesValidator,
    postValidtor.repoUrlValidator,
    handleValidationError,
    projectPostController.createPost
)

//http://localhost:8080/mostafa abokhadra/projects
// getting all user post
router.get('/:username/projects',
    // ensureAuthenticated, // route don't need authentication
    projectPostController.getPosts
)

// http://localhost:8080/mostafa abokhadra/projects/3
// get specific post by id
router.get(
    "/:username/projects/:projectId",
    // ensureAuthenticated, // don't need authentication
    projectPostController.getPostById
)

// http://localhost:8080/mostafa abokhadra/projects/3
// update a project post
router.put(
    '/:username/projects/:projectId',
    ensureAuthenticated,
    projectPostController.updatePost
)

// http://localhost:8080/mostafa abokhadra/projects/3
// delete a project post
router.delete(
    '/:username/projects/:projectId',
    ensureAuthenticated,
    projectPostController.deletePost
)

module.exports = router