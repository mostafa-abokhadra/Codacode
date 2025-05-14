const {param} = require('express-validator')

const validateRoleId = [
    param('role_id').notEmpty().withMessage("roleId is required")
    .isInt({gt: 0}).withMessage("roleId must be a postive integer")
]

const validateRequestId = [
    param('requestId').notEmpty().withMessage("requestId is required")
    .isInt({gt: 0}).withMessage("requestId must be a positive integer")
]
module.exports = {
    validateRoleId,
    validateRequestId
}