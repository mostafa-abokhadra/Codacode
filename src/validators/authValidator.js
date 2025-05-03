const {body} = require("express-validator")
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const fullNameValidator = [
    body('fullName')
    .trim()
    .escape()
    .notEmpty().withMessage("fullName field is required")
    .isString().withMessage("name must be a string")
    .isLength({min: 10}).withMessage('must be at least 10 - 20 character')
    .custom((value) =>  {
        const isAlphanum = /^[a-z0-9]$/i.test(value[0]);
        if (!isAlphanum)
            throw new Error('first char must be a letter or number')
        return 1
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
    .custom(async (value) => {
        const user = await prisma.user.findFirst({
            where: {email: value}
        })
        if (user)
            throw new Error('An account with this email already exists. Did you mean to log in instead?')
        return 1
    })
]

function CheckIsAlphaNum(value) {
    const isAlphanum = /^[a-z0-9]$/i.test(value);
    if (!isAlphanum)
        return 0
    return 1
}

const passwordValidator = [
    body("password")
    .escape()
    .not().isEmpty().withMessage("password is required")
    .isLength({min:8})
    .withMessage(`password can't be less than 8 characters`)
    .custom((value) => {
        // constains special character
        for(let i =0; i < value.length; i++) {
            if (!CheckIsAlphaNum(value[i]))
                return true
        }
        throw new Error('must contain at least 1 special character')
    })
    .custom((value) => {
        // contains a number
        for(let i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57)
                return true
        }
        throw new Error('must contain at least one number')
    })
    .custom((value) => {
        // contains capital letter
        for(let i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90)
                return true
        }
        throw new Error('must contain at least 1 capital letter')
    })
    .custom((value) => {
        // contains capital letter
        for(let i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122)
                return true
        }
        throw new Error('must contain at least 1 small letter')
    }),

    body('confirmPassword')
    .escape()
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            console.log('an error')
            throw new Error('Passwords do not match');
        }
        return true;
    }),
]

module.exports = {
    fullNameValidator,
    emailValidator,
    passwordValidator,
}
