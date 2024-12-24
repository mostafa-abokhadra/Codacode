const router = require("express").Router()
const noAuthController = require("../controllers/noAuthContoller")

router.get("/IdeaBank", noAuthController.getIdeas)

router.get("/:username/portofolio", noAuthController.getUserPortofolio)

module.exports = router