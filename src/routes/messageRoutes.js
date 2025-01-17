const router = require('express').Router()
const { ensureAuthenticated } = require("../middlewares/checkSession")
const messageController = require('../controllers/messagesController')

router.post(
    '/:username/projects/:projectId/message',
    ensureAuthenticated,
    messageController.createMessage
)
// router.get(
//     '/projects/:projectId/messages',
//     ensureAuthenticated
// )

module.exports = router