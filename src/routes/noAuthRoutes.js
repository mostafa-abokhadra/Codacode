const router = require("express").Router()
const noAuthController = require("../controllers/noAuthContoller")

router.get("/IdeaBank", noAuthController.getIdeas)

router.get("/:username/portofolio", noAuthController.getUserPortofolio)

router.get("/projects", noAuthController.getAllPosts)

module.exports = router