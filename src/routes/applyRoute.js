const { ensureAuthenticated } = require("../middlewares/checkSession")
const applyController = require("../controllers/applyController")
const router = require("express").Router()
const requestValidator = require("../validators/requestsValidators")
const handleValidationErrors = require("../middlewares/validationErrorHandler")

router.post(
    "/:userAppliedName/roles/:roleId",
    ensureAuthenticated,
    requestValidator.validateRoleId,
    handleValidationErrors,
    applyController.postApplyRequest
)

// send to me requests
router.get(
    "/:username/requests",
    ensureAuthenticated,
    requestValidator.validateUserName,
    handleValidationErrors,
    applyController.getSendToMeRequests
)

module.exports = router