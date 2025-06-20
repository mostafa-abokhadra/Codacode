const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class messageController {
    static async createMessage(userId, message, projectId) {
        try {
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
                return {"status": '404', message: `can't find the project`}

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
                            id: parseInt(userId)
                        }
                    }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            profile: {
                                select: {
                                    image: true
                                }
                            }
                        }
                    }
                }
            })

            if (!createMessage)
                return {'status': '500', message: `can't create a message`}
            
            return {status: '200', message: "message created successfully", message: createMessage}
        } catch(error) {
            console.error("An Unexpected Error Occur", error)
            return {'status': '500', message: `can't create a message`}
        }
    }
    static async getProjectMessages(req, res) {
        try {
            const {project_id} = req.params
            const messages = await prisma.message.findMany({
                where: {
                    group: {
                        team: {
                            project: {
                                id: parseInt(project_id)
                            }
                        }
                    }
                },
                include: {
                    user: {
                        include: {
                            profile: true
                        }
                    },
                    group: {
                        include: {
                            team: true
                        }
                    }
                },
                orderBy: {
                    sendedAt: 'asc'
                }
            })
            if (messages.length === 0)
                return res.status(204).json({"message": `no messages found`})
            return res.status(200).json({"info": 'messages retrieved successfully', messages: messages})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": 'an error has occured'})
        }
    }
}
module.exports = messageController