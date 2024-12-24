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
            // return res.status(200).json({
            //     "message": "project created successfully",
            //     user: user
            // })
            return res.redirect(`/${req.user.urlUserName}/posts`)
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async getProjects(req, res) {
        try {
            const {username} = req.params
            const user = await prisma.user.findFirst({
                where: {fullName: username},
                include: {
                    Projects: {
                        include: {
                            team: {
                                include: {
                                    group: true
                                }
                            }
                        }
                    }
                }
            })
            if (!user)
                return res.status(401).json({"message": "can't get projects"})
            return res.render('projects.ejs', {user: user})
            // return res.status(200).json({"message": "projects retrieved successfully", projects: user.Projects})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured, check the console"})
        }
    }
    
    static async getAssignedProjects(req, res) {
        try {
            const {username} = req.params
            const user = await prisma.user.findFirst({
                where: {fullName: username},
                include: {
                    assignedProjects: {
                        include: {
                            team: {
                                include: {
                                    group: true
                                }
                            }
                        }
                    }
                }
            })
            if (!user)
                return res.status(401).json({"message": "can't retrieve assigned projects"})
            return res.status(200).json({"message": "assigned projects retrieved successfully", assigned: user.assignedProjects})

        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured check your console"})
        }
    }

    static async getProjectById(req, res) {
        try {
            const {username, projectId} = req.params
            const user = await prisma.user.findFirst({
                where: {fullName: username},
                include: {
                    assignedProjects: {
                        include: {
                            team: {
                                include: {
                                    group: {
                                        include: {
                                            messages: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            if (!user)
                return res.status(403).json({"message": "no user found"})
            let project = await prisma.project.findFirst({
                where: {id: parseInt(projectId), owner_id: user.id},
                include: {
                    team: {
                        include: {
                            group: {
                                include: {
                                    messages: true
                                }
                            },
                            members: true
                        }
                    }
                }
            })
            if (!project) {
                project = user.assignedProjects.some((item) => {
                    project = item
                    return item.id === parseInt(projectId)
                })
                if (!project)
                    return res.status(403).json({"message": "project not found"})
                project = user.assignedProjects
            }
            return res.status(200).json({"message": "project retrieved successfully", project: project})
        } catch(error) {
            console.log(error)
            return res.status(200).json({"message": "an error has occured, check the console"})
        }
    }

    static async getAllProjects(req, res) {
        try {
            const {username} = req.params
            const user = await prisma.user.findFirst({
                where: {fullName: req.user.fullName},
                select: {
                    id: true,
                    fullName: true,
                    Projects: { include: { team: { include: { group: {include: {messages: true} },  members: true } } } },
                    assignedProjects: { include: { team: { include: { group: {include: {messages: true}}, members: true} } } }
                },
                // include: {
                //     Projects: { include: { team: { include: { group: {include: {messages: true} },  members: true } } } },
                //     assignedProjects: { include: { team: { include: { group: {include: {messages: true}}, members: true} } } }
                // }
            })
            if (!user)
                return res.status(401).json({"message": "can't find user projects"})
            // return res.status(200).json({
            //     "message": "projects retrieved successfully",
            //     projects: user.Projects, assigned: user.assignedProjects
            // })
            user.urlUserName = req.user.urlUserName
            return res.render('userProjects', {user: user})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }
}

module.exports = projectController