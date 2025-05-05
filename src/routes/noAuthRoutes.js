const router = require("express").Router()
const noAuthController = require("../controllers/noAuthContoller")

// router.get("/IdeaBank", noAuthController.getIdeas)

router.get("/portofolio", noAuthController.getUserPortofolio)

router.get("/projects", noAuthController.getAllPosts)

router.get('/about', noAuthController.getAbout)
module.exports = router