const router = require('express').Router()
const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated
const messageController = require('../controllers/messagesController')

router.get(
    '/users/:user_id/projects/:project_id/messages',
    ensureAuthenticated,
    messageController.getProjectMessages
)
module.exports = router