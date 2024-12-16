const router = require('express').Router()

const checkSession = require('../middlewares/checkSession')

const postValidtor = require('../validators/postValidator')
const handleValidationError = require('../middlewares/validationErrorHandler')

const postController = require('../controllers/postController')

// creating a new post
// create roles of that post
router.post(
    '/:username/posts',
    checkSession.ensureAuthenticated,
    checkSession.ensureValidUser,
    // postValidtor.titleValidator,
    // postValidtor.descriptionValidator,
    // postValidtor.rolesValidator,
    // postValidtor.repoUrlValidator,
    handleValidationError,
    postController.createPost
)

// getting all user post
// getting roles as well
router.get(
    '/:username/posts',
    postController.getPosts
)

// get specific post by id
// get it's roles as well
router.get(
    "/:username/posts/:postId",
    postController.getPostById
)

// update a post
router.put(
    '/:username/posts/:postId',
    checkSession.ensureAuthenticated,
    checkSession.ensureValidUser,
    postController.updatePost
)

// delete a project post
router.delete(
    '/:username/posts/:postId',
    checkSession.ensureAuthenticated,
    checkSession.ensureValidUser,
    postController.deletePost
)

module.exports = router