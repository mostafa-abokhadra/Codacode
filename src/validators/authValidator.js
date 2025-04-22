const {body} = require("express-validator")
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function checkFullNameAvailability(req, res) {
    let availablity = true
    const user = await prisma.user.findFirst({
        where: {fullName: req.body.fullName}
    })
    if (user)
        availablity = false
    return res.status(403).json({available: availablity})
}

async function checkEmailAvailability(req, res) {
    let availablity = true
    const user = await prisma.user.findFirst({
        where: {email: req.body.email}
    })
    if (user)
        availablity = false
    return res.status(403).json({available: availablity})
}

const fullNameValidator = [
    body('fullName')
    .trim()
    .escape()
    .notEmpty().withMessage("fullName field is required")
    .isString().withMessage("name must be a string")
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
    passwordValidator,
    checkFullNameAvailability,
    checkEmailAvailability
}
