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
            // const updatedUser = await utils.getUpdatedUser(userApplied.email)
            return res.status(200).json({
                "message": "request to role sent successfully"
            })
        } catch(error) {
            console.log(error)
            return res.status(500).json("an error occured, look in console")
        }
    }

    static async getSendToMeRequests(req, res) {
        try {
            const {username} = req.params
            const user = await prisma.user.findFirst({
                where: {fullName: username},
                include: {
                    posts: {
                        include: {
                            roles: {
                                include: {
                                    requests: true
                                }
                            }
                        }
                    }
                }
            })
            if (!user)
                return res.status(403).json({"message": "user don't have any requests"})
            let requests = []
            for (let i = 0; i < user.posts.length; i++) {
                for (let j = 0; j < user.posts[i].roles.length; j++) {
                    for (let k = 0; k < user.posts[i].roles[j].requests.length; k++) {
                        requests.push(user.posts[i].roles[j].requests[k])
                    }
                }
            }
            return res.status(200).json({
                "message": "requests retrieved successfully",
                "requests": requests
            })

        } catch(error) {
            console.log(error)
            return res.status(500).json({"meessage": "an error occured, check the console"})
        }
    }
}

module.exports = requestsController