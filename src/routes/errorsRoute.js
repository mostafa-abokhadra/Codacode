const router = require('express').Router()
const errorsController = require('../controllers/errorsController')

router.get(
    '/server-error',
    errorsController.getServerError
)

module.exports = router