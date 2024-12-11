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

module.exports = router