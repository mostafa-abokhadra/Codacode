const {body, param} = require('express-validator')

const validateUserName = [
    param('username').notEmpty().withMessage("username can't be empty")
    .isString().withMessage("username must be a string")
    .custom((value, {req}) => {
        if (value !== req.user.fullName)
            throw new Error("authenticated user mismatch")
        return true
    })
];

const validateRoleId = [
    param('roleId').notEmpty().withMessage("roleId is required")
    .isInt({gt: 0}).withMessage("roleId must be a postive integer")
]

module.exports = {
    validateUserName,
    validateRoleId
}