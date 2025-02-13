const {body} = require('express-validator')

const nameValidator = [
    body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Portfolio Name Must Not Be Empty')
    .isString().withMessage('Your Portfolio Name Must Be a String')
    .isLength({max: 40}).withMessage('Your Portfolio Name Must Be Less Than 40 Characters')
]
const taglineValidator = [
    body('tagline')
    .trim()
    .escape()
    .notEmpty().withMessage('Tagline Must Not Be Empty')
    .isString().withMessage('Your Tagline Must Be a String')
    .isLength({max: 80}).withMessage('Your Tagline Must Be Less Than 80 Characters')
]
const aboutValidator = [
    body('about')
    .trim()
    .escape()
    .notEmpty().withMessage('About Must Not Be Empty')
    .isString().withMessage('About Must Be a String')
    .isLength({max: 200}).withMessage('About Must Be Less Than 200 Characters')
]

module.exports = {
    nameValidator,
    taglineValidator,
    aboutValidator
}