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
    ensureAuthenticated,
    ensureValidUser,
    projectController.getProjects
)

// getting projects that i particaipate in
router.get(
    "/:username/assigned/projects",
    ensureAuthenticated,
    ensureValidUser,
    projectController.getAssignedProjects
)

// getting a project by id
router.get(
    '/:username/projects/:projectId',
    ensureAuthenticated,
    ensureValidUser,
    projectController.getProjectById
)

router.get(
    "/:username/all/projects",
    ensureAuthenticated,
    // ensureValidUser,
    projectController.getAllProjects
)

// get owner roles in a project
router.get(
    "/:username/projects/:projectId/roles",
    ensureAuthenticated,
    projectController.getUserProjectsRoles
)

// get user roles in a project
router.get(
    "/:username/assignedProjects/:projectId/roles",
    ensureAuthenticated,
    projectController.getUserAssignedProjectsRoles
)
router.get(
    "/:username/projects/:projectId/team/avatars",
    ensureAuthenticated,
    projectController.getProjectTeamProfileAvatars
)
// still not sure if i will implement these routes beneath
// router.put("/:username/project/:projectId")
// router.delete("/:username/project/:projectId")

module.exports = router