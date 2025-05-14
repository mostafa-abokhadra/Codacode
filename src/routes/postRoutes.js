const router = require('express').Router()

const checkSession = require('../middlewares/checkSession')

const postValidtor = require('../validators/postValidator')
const handleValidationError = require('../middlewares/validationErrorHandler')

const postController = require('../controllers/postController')

// creating a new post
// create roles of that post
router.post(
    '/users/:user_id/posts',
    checkSession.ensureAuthenticated,
    postValidtor.titleValidator,
    postValidtor.descriptionValidator,
    postValidtor.rolesValidator,
    postValidtor.repoUrlValidator,
    postValidtor.langPrefValidator,
    postValidtor.yourRoleValidator,
    handleValidationError,
    postController.createPost
)

// getting all user post
// getting roles as well
router.get(
    '/user/:user_id/posts',
    postController.getPosts
)

// get specific post by id
// get it's roles as well
router.get(
    "/user/:user_id/posts/:post_id",
    postController.getPostById
)

// update a post
router.put(
    '/user/:user_id/posts/:post_id',
    checkSession.ensureAuthenticated,
    postController.updatePost
)

// delete a project post
router.delete(
    '/user/:user_id/posts/:post_id',
    checkSession.ensureAuthenticated,
    postController.deletePost
)

module.exports = router