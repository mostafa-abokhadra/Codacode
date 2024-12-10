const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const utils = require('../utils/utils')
class requestsController {

    static async postApplyRequest(req, res) {
        try {
            const {username, roleId} = req.params
            const role = await prisma.role.findFirst({
                where: {id: parseInt(roleId)},
                include: {
                    post: {
                        include: {
                            user: true
                        }
                    },
                    requests: true
                }
            })
            if (!role)
                return res.status(403).json({"message": "can't find role"})
            if (role.post.user.id === req.user.id)
                return res.status(403).json({"message": "can't apply to your own porject"})
            const userApplied = await prisma.user.findFirst({
                where: {fullName: username}
            })
            if (!userApplied)
                return res.status(403).json({"message": "user want to apply not found"})
            let exist = false;
            for (let i = 0; i < role.requests.length; i++) {
                if (req.user.id === role.requests[i].userApplied_id) {
                    exist = true; break;
                }
            }
            if (exist)
                return res.status(403).json({"message": "user already have applied to this position"})
            const createRequest = await prisma.request.create({
                data: {
                    role: {
                        connect: {id: role.id}
                    },
                    userApplied: {
                        connect: {id: userApplied.id}
                    }
                }
            })
            if (!createRequest)
                return res.status(500).json({"message": "can't send a request"})
            const updateRole = await prisma.role.update({
                where: {id: role.id},
                data: {
                    requests:{
                        connect: {
                            id: createRequest.id
                        }
                    },
                    applied: parseInt(role.applied) + 1
                }
            })
            if (!updateRole) {
                // will delete the garbage request
                const deleteGarbageRequest = await utils.deleteGarbageRequest(createRequest.id)
                return res.status(500).json({"message": "can't update the role request"})
            }
            const updatedUser = await utils.getUpdatedUser(userApplied.email)
            return res.status(200).json({
                "message": "request to role sent successfully",
                user: updatedUser
            })
        } catch(error) {
            return res.status(500).json("an error occured, look in console")
        }
    }

    static async getSendToMeRequests(req, res) {
        try {
            const {username} = req.params
            const sendToMe = await utils.getSendToMeRequests(username)
            if (sendToMe.hasOwnProperty("error"))
                return res.status(500).json(sendToMe)
            return res.status(200).json(sendToMe)
        } catch(error) {
            return res.status(500).json({"meessage": "an error occured, check the console"})
        }
    }

    static async getPendingRequests(req, res) {
        try {
            const {username} = req.params
            const pending = await utils.getPendingRequests(username)
            if (pending.hasOwnProperty("error"))
                return res.status(500).json(pending)
            return res.status(200).json(pending)
        } catch(error) {
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async cancelRequest(req, res) {
        try {
            const {username, requestId} = req.params
            const checkRequest = await prisma.request.findFirst({
                where: {id: parseInt(requestId), userApplied_id: req.user.id}
            })
            if (!checkRequest)
                return res.status(403).json({"message": "request doesn't exist for given user"})
            const request = await prisma.request.delete({
                where: {
                    id: parseInt(requestId),
                    userApplied_id: req.user.id
                },
                include: {
                    role: true
                }
            })
            if (!request)
                return res.status(403).json({"message": "can't cancel request"})
            const updateRole = await prisma.role.update({
                where: {id: request.role_id},
                data: {
                    applied: request.role.applied - 1
                }
            })
            if (!updateRole) {
                return res.status(500).json({
                    "message": "can't update role after deletion",
                    solve: "upate applied field manually",
                    roleId: request.role.id
                })
            }
            return res.redirect(`/${username}/pending`)
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }
}

module.exports = requestsController