const { ensureAuthenticated} = require("../middlewares/checkSession")
const projectController = require("../controllers/projectController")
const projectValidator = require("../validators/projectValidator")


const router = require("express").Router()

router.post(
    "/user/:user_id/posts/:post_id/project",
    ensureAuthenticated,
    projectValidator.postIdValidator,    
    projectController.createProject
)

// getting my project (i am the owner)
router.get(
    '/user/:user_id/projects',
    ensureAuthenticated,
    projectController.getProjects
)

// getting projects that i particaipate in
router.get(
    "/user/:user_id/assigned/projects",
    ensureAuthenticated,
    projectController.getAssignedProjects
)

// getting a project by id
router.get(
    '/user/:user_id/projects/:project_id',
    ensureAuthenticated,
    projectController.getProjectById
)

router.get(
    "/users/:user_id/all/projects",
    ensureAuthenticated,
    // ensureValidUser,
    projectController.getAllProjects
)

// get owner roles in a project
router.get(
    "/users/:user_id/projects/:project_id/roles",
    ensureAuthenticated,
    projectController.getUserProjectsRoles
)

// get user roles in a project
router.get(
    "/users/:user_id/assigned_projects/:project_id/roles",
    ensureAuthenticated,
    projectController.getUserAssignedProjectsRoles
)
router.get(
    "/users/:user_id/projects/:project_id/team/avatars",
    ensureAuthenticated,
    projectController.getProjectTeamProfileAvatars
)
// still not sure if i will implement these routes beneath
// router.put("/:username/project/:projectId")
// router.delete("/:username/project/:projectId")

module.exports = router