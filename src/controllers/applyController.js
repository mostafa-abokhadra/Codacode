const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const utils = require('../utils/utils')
class applyController {

    static async postApplyRequest(req, res) {
        try {
            const {userAppliedName, roleId} = req.params
            const role = await prisma.role.findFirst({
                where: {id: parseInt(roleId)},
                include: {
                    post: {
                        include: {
                            user: true
                        }
                    }
                }
            })
            if (!role)
                return res.status(403).json({"message": "can't find role"})
            if (role.post.user.id === req.user.id)
                return res.status(403).json({"message": "can't apply to your own porject"})
            const userApplied = await prisma.user.findFirst({
                where: {fullName: userAppliedName}
            })
            if (!userApplied)
                return res.status(403).json({"message": "can't find user"})
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
                    }
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
            console.log(error)
            return res.status(500).json("an error occured, look in console")
        }
    }
}

module.exports = applyController