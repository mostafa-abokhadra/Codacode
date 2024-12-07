const { ensureAuthenticated } = require("../middlewares/checkSession")
const applyController = require("../controllers/applyController")
const router = require("express").Router()
const requestValidator = require("../validators/requestsValidators")
const handleValidationErrors = require("../middlewares/validationErrorHandler")

// apply to a position
router.post(
    "/:username/roles/:roleId",
    ensureAuthenticated,
    requestValidator.validateUserName,
    requestValidator.validateRoleId,
    handleValidationErrors,
    applyController.postApplyRequest
)

// get send-to-me requests
router.get(
    "/:username/requests",
    ensureAuthenticated,
    requestValidator.validateUserName,
    handleValidationErrors,
    applyController.getSendToMeRequests
)

module.exports = router