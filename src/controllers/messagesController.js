const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class messageController {
    static async createMessage(req, res) {
        try {
            const {projectId} = req.params
            const {user} = req.user
            const {message} = req.body

            const project = await prisma.project.findFirst({
                where: {id: parseInt(projectId)},
                include: {
                    team: {
                        include: {
                            group: true
                        }
                    }
                }
            })

            if (!project)
                return res.status(400).json({"message": "can't find project with given id"})

            const createMessage = await prisma.message.create({
                data: {
                    sendedAt: new Date(),
                    content: message,
                    group: {
                        connect: {
                            id: project.team.group.id
                        }
                    },
                    user: {
                        connect: {
                            id: user.id
                        }
                    }
                }
            })

            if (!createMessage)
                return res.status(500).json({"message": "can't create a message"})
            
            return res.status(200).json({"message": "message created successfully"})
        } catch(error) {
            console.error("An Unexpected Error Occur", error)
            return res.status(500).json({"message": "can't create a message"})
        }
    }
    // static async getProjectMessages(req, res) {

    // }
}
module.exports = messageController