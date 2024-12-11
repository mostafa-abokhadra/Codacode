const {param} = require("express-validator")

const postIdValidator = [
    param('postId').notEmpty().withMessage("postId is required")
    .isInt({gt: 0}).withMessage("postId must be a positive integer")
]

module.exports =  {
    postIdValidator
}