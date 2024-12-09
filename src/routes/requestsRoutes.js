const { ensureAuthenticated } = require("../middlewares/checkSession")
const requestsController = require("../controllers/requestsController")
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
    requestsController.postApplyRequest
)

// get send-to-me requests
router.get(
    "/:username/requests",
    ensureAuthenticated,
    requestValidator.validateUserName,
    handleValidationErrors,
    requestsController.getSendToMeRequests
)

// get i-send-requests
router.get(
    '/:username/requests/pending',
    ensureAuthenticated,
    requestValidator.validateUserName,
    handleValidationErrors,
    requestsController.getPendingRequests
)
module.exports = router