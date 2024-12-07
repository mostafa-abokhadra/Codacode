const {body} = require("express-validator")
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const fullNameValidator = [
    body('fullName')
    .trim()
    .escape()
    .notEmpty().withMessage("fullName field is required")
    .isString().withMessage("name must be a string")
    .custom(async (value) => {
        const user = await prisma.user.findFirst({
            where: {fullName: value}
        })
        if (user)
            throw new Error("name already exist, please try another name")
        return true
    })
]

const emailValidator = [
    body('email')
    .trim()
    .escape()
    .not().isEmpty().withMessage(`email is required`)
    .normalizeEmail()
    .isEmail()
    .withMessage("invalid email address")
]

const passwordValidator = [
    body("password")
    .escape()
    .not().isEmpty().withMessage("password is required")
    .isLength({min:8})
    .withMessage(`password can't be less than 8 characters`),

    body('confirmPassword')
    .escape()
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
]

module.exports = {
    fullNameValidator,
    emailValidator,
    passwordValidator
}
