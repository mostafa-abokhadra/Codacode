const checksession = require("../middlewares/checkSession")
const requestsController = require("../controllers/requestsController")
const router = require("express").Router()
const requestValidator = require("../validators/requestsValidators")
const handleValidationErrors = require("../middlewares/validationErrorHandler")

// get send to me requests
router.get(
    "/requests",
    checksession.ensureAuthenticated,
    handleValidationErrors,
    requestsController.getSendToMeRequests
)

// accept a reqeust send to me
router.post(
    '/users/:user_id/requests/:request_id/accept',
    checksession.ensureAuthenticated,
    // requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.acceptRequest
)

router.delete(
    "/users/:user_id/requests/:request_id/reject",
    checksession.ensureAuthenticated,
    // requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.rejectRequest
)

// apply to a position
router.post(
    "/user/:user_id/posts/:post_id/roles/:role_id",
    checksession.ensureAuthenticated,
    requestValidator.validateRoleId,
    handleValidationErrors,
    requestsController.postApplyRequest
)


// get pending requests
router.get(
    '/pending',
    checksession.ensureAuthenticated,
    handleValidationErrors,
    requestsController.getPendingRequests
)

// cancel sended request
router.delete(
    '/:username/requests/:requestId',
    checksession.ensureAuthenticated,
    requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.cancelRequest
)




// don't show
router.put(
    '/:username/requests/:requestId/show',
    checksession.ensureAuthenticated,
    requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.updateShowStatus
)

router.put(
    '/:username/requests/:requestId/showInPending',
    checksession.ensureAuthenticated,
    requestValidator.validateRequestId,
    handleValidationErrors,
    requestsController.updateShowInPending
)
module.exports = router