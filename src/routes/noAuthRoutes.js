const router = require("express").Router()
const noAuthController = require("../controllers/noAuthContoller")

// router.get("/IdeaBank", noAuthController.getIdeas)

router.get("/projects", noAuthController.getProjects)

router.get("/portofolio", noAuthController.getUserPortofolio)

router.get('/about', noAuthController.getAbout)

module.exports = router