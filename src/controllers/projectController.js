const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const utils = require("../utils/utils")

class projectController {
    static async createProject(req, res) {
        try {
            const {username, postId} = req.params
            // getting the post
            const post = await prisma.post.findFirst({
                where: {
                    user: {
                        fullName: username
                    },
                    id: parseInt(postId),
                },
                include: {user: true}
            })
            if (!post)
                return res.status(403).json({"message": "no post exist to create a project"})
            // creating a team
            const team = await prisma.team.create({
                data: {
                    members: {
                        connect: {
                            id: post.user.id
                        }
                    } 
                }
            })
            if (!team)
                return res.status(500).json({"message": "can't create a team for the project"})
            // creating a group for the team
            const group = await prisma.group.create({
                data: {
                    team: {
                        connect: {
                            id: team.id
                        }
                    }
                }
            })
            if (!group) {
                return res.status(500).json({
                    "message": "can't create a group for the team",
                    "garbageTeam Id": team.id
                })
            }
            // create a project
            const project = await prisma.project.create({
                data: {
                    repo: post.repo,
                    owner: {
                        connect: {
                            id: post.user.id
                        }
                    },
                    post: {
                        connect: {
                            id: post.id
                        }
                    },
                    team: {
                        connect: {
                            id: team.id
                        }
                    },
                    status: "waitingForTeam"
                }
            })
            if (!project) {
                return res.status(500).json({
                    "message": "can't create a project from the given post",
                    "garbage team id": team.id
                })
            }
            const user = await utils.getUpdatedUser(post.user.email)
            if (user.hasOwnProperty('message'))
                return res.status(500).json(user)
            return res.status(200).json({
                "message": "project created successfully",
                user: user
            })
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }
}

module.exports = projectController