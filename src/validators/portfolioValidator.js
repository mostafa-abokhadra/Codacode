const {body} = require('express-validator')

const nameValidator = [
    body('name')
    .trim()
    .notEmpty().withMessage('Name Must Not Be Empty')
    .isString().withMessage('Name Must Be a String')
    .isLength({max: 40}).withMessage('Name Must Be Less Than 40 Characters')
]
const taglineValidator = [
    body('tagline')
    .trim()
    .notEmpty().withMessage('Tagline Must Not Be Empty')
    .isString().withMessage('Tagline Must Be a String')
    .isLength({max: 80}).withMessage('Tagline Must Be Less Than 80 Characters')
]
const aboutValidator = [
    body('about')
    .trim()
    .notEmpty().withMessage('About Must Not Be Empty')
    .isString().withMessage('About Must Be a String')
    .isLength({max: 200}).withMessage('About Must Be Less Than 200 Characters')
]

module.exports = {
    nameValidator,
    taglineValidator,
    aboutValidator
}