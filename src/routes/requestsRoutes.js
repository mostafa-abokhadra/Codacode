const checksession = require("../middlewares/checkSession")
const requestsController = require("../controllers/requestsController")
const router = require("express").Router()
const requestValidator = require("../validators/requestsValidators")
const handleValidationErrors = require("../middlewares/validationErrorHandler")

// apply to a position
router.post(
    "/:username/roles/:roleId",
    checksession.ensureAuthenticated,
    checksession.ensureValidUser,
    requestValidator.validateRoleId,
    handleValidationErrors,
    requestsController.postApplyRequest
)

// get send to me requests
router.get(
    "/:username/requests",
    checksession.ensureAuthenticated,
    checksession.ensureValidUser,
    handleValidationErrors,
    requestsController.getSendToMeRequests
)

// get pending requests
router.get(
    '/:username/pending',
    checksession.ensureAuthenticated,
    checksession.ensureValidUser,
    handleValidationErrors,
    requestsController.getPendingRequests
)

// cancel sended request
router.delete(
    '/:username/requests/:requestId',
    checksession.ensureAuthenticated,
    checksession.ensureValidUser,
    requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.cancelRequest
)

// accept a reqeust send to me
router.post(
    '/:username/requests/:requestId/accept',
    checksession.ensureAuthenticated,
    checksession.ensureValidUser,
    requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.acceptRequest
)

router.delete(
    "/:username/requests/:requestId/reject",
    checksession.ensureAuthenticated,
    checksession.ensureValidUser,
    requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.rejectRequest
)

module.exports = router