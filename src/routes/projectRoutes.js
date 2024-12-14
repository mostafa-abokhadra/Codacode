const { ensureAuthenticated, ensureValidUser } = require("../middlewares/checkSession")
const projectController = require("../controllers/projectController")
const projectValidator = require("../validators/projectValidator")

const router = require("express").Router()

router.post(
    "/:username/posts/:postId/projects",
    ensureAuthenticated,
    ensureValidUser,
    projectValidator.postIdValidator,    
    projectController.createProject
)

// getting my project (l am the owner)
router.get(
    '/:username/projects',
    projectController.getProjects
)

module.exports = router