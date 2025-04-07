const { objectEnumNames } = require('@prisma/client/runtime/library')
const { getRandomValues } = require('crypto')
const {body} = require('express-validator')

const isString = (value) => {
        if (typeof value !== 'string' || !isNaN(Number(value)))
            return false
        return true
}

const nameValidator = [
    body('name')
    .trim()
    .notEmpty().withMessage('Name Must Not Be Empty')
    .custom((value) => {
        if (!isString(value))
            throw new Error('name must be a string, not a number');
        return true
    })
    .isLength({max: 40}).withMessage('Name Must Be Less Than 40 Characters')
]
const taglineValidator = [
    body('tagline')
    .trim()
    .notEmpty().withMessage('Tagline Must Not Be Empty')
    .custom((value) => {
        if (!isString(value))
            throw new Error('tagline must be a string, not a number');
        return true
    })
    .isLength({max: 80}).withMessage('Tagline Must Be Less Than 80 Characters')
]
const aboutValidator = [
    body('about')
    .trim()
    .notEmpty().withMessage('About Must Not Be Empty')
    .isString().withMessage('About Must Be a String')
    .custom((value) => {
        if (!isString(value))
            throw new Error('about must be a string')
        return true
    })
    .isLength({max: 200}).withMessage('About Must Be Less Than 200 Characters')
]
const courseValidator = [
    body('course')
    .trim()
    .notEmpty().withMessage('course is required')
    .custom((value) => {
        if (!isString(value))
            throw new Error('course must be a string')
        return true
    })
    .isLength({max: 40}).withMessage(`course shouldn't exceed 40 characters`)
]
const degreeValidator = [
    body('degree')
    .trim()
    .notEmpty().withMessage('degree is required')
    .custom((value) => {
        if (!isString(value))
            throw new Error('degree must be a string')
        return true
    })
    .isLength({max: 30}).withMessage(`degree shouldn't exceed 30 characters`)
]
const organizatoinValidator = [
    body('organization')
    .trim()
    .notEmpty().withMessage('organization is required')
    .custom((value) => {
        if (!isString(value))
            throw new Error('organization must be a string')
        return true
    })
    .isLength({max: 30}).withMessage(`organization shouldn't exceed 30 characters`)
]


const validateDateObject = (fieldName) =>
    body(fieldName).custom((value) => {
    if (
        typeof value !== 'object' ||
        Array.isArray(value) ||
        value === null
    ) {
        throw new Error(`${fieldName} must be an object`);
    }

    const keys = Object.keys(value);
    const validKeys = ['day', 'month', 'year'];

    if (keys.length !== 3) {
        throw new Error(`${fieldName} must contain exactly 3 fields: day, month, and year`);
    }

    for (const key of keys) {
        if (!validKeys.includes(key)) {
        throw new Error(`Valid ${fieldName} keys are [day, month, year]`);
        }

        if (typeof value[key] !== 'number') {
        throw new Error(`${fieldName}.${key} must be a number`);
        }
}
    return true;
});

const dateRangeValidator = [
    validateDateObject('startDate'),
    validateDateObject('endDate'),

    body().custom((value, { req }) => {
        const { startDate, endDate } = req.body;
    
        const start = new Date(startDate.year, startDate.month - 1, startDate.day);
        const end = new Date(endDate.year, endDate.month - 1, endDate.day);
    
        if (end < start) {
            throw new Error('endDate must be after startDate');
        }
    
        return true;
    })
];


module.exports = {
    nameValidator,
    taglineValidator,
    aboutValidator,
    courseValidator,
    degreeValidator,
    organizatoinValidator,
    dateRangeValidator
}