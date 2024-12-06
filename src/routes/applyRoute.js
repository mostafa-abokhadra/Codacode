const { ensureAuthenticated } = require("../middlewares/checkSession")
const applyController = require("../controllers/applyController")
const router = require("express").Router()

router.post(
    "/:userAppliedName/roles/:roleId",
    ensureAuthenticated,
    applyController.postApplyRequest
)

module.exports = router