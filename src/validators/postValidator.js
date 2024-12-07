const {body} = require('express-validator')

const titleValidator = [
    body('title')
    .trim()
    .escape()
    .notEmpty().withMessage("title is required")
    .isLength({max: 50}).withMessage("title is too long")
]
const descriptionValidator = [
    body('description')
    .trim()
    .escape()
    .notEmpty().withMessage("description is required")
    .isLength({max: 250}).withMessage("description shoud be less than 250 cahracter")
]
const rolesValidator = [
    body('roles')
    .notEmpty().withMessage("at least on role is required")
    .custom((arr) => {
        if (!Array.isArray(arr))
            throw new Error("roles must be an array")
        if (arr.length === 0)
            throw new Error("at least on role is required")
        for (let i = 0; i < arr.length; i++) {
            if (typeof arr[i] !== 'object' || arr[i] === null) {
                throw new Error("roles must be objects")
            }
            if (!('role' in arr[i]) || !('no' in arr[i])) {
                throw new Error("Each role item must have 'role' and 'no' fields");
            }
            if (typeof arr[i].role !== 'string' || !Number.isInteger(arr[i].no) || arr[i].no < 0)
                throw new Error("Role must be a string, and 'no' must be a positive integer")
            if (Object.keys(arr[i]).length !== 2) {
                throw new Error("Each role item must have exactly 'role' and 'no' fields");
            }
        }
        return true
    })
]
const repoUrlValidator = [
    body('repo')
    .trim()
    .escape()
    .notEmpty().withMessage('Repository URL is required')
    .isURL().withMessage('Repository URL must be a valid URL')
]

module.exports = {
    titleValidator,
    descriptionValidator,
    rolesValidator,
    repoUrlValidator  
}