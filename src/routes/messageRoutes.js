const router = require('express').Router()
const ensureAuthenticated = require('../middlewares/checkSession').ensureAuthenticated
const messageController = require('../controllers/messagesController')

router.get(
    '/:username/projects/:projectId/messages',
    ensureAuthenticated,
    messageController.getProjectMessages
)
module.exports = router