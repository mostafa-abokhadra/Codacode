const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const utils = require("../utils/utils")

class projectController {
    static async createProject(req, res) {
        try {
            const {post_id} = req.params
            const post = await prisma.post.findFirst({
                where: {
                    user: {
                        id: req.user.id
                    },
                    id: parseInt(post_id),
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
                    "garbage team id": team.id,
                    "garbage post id": post.id
                })
            }
            // const user = await utils.getUpdatedUser(post.user.email)
            // if (user.hasOwnProperty('message'))
            //     return res.status(500).json(user)
            return res.status(201).json({
                "message": "project created successfully",
            })
            // return res.redirect(`/${req.user.urlUserName}/posts`)
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
                    profile: true,
                    Projects: {
                        include: {
                            post: true,
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
                    },
                    assignedProjects: { 
                        include: { 
                            post: true,
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
                    }
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

    static async getUserAssignedProjectsRoles(req, res) {
        try {
            const {username, projectId} = req.params
            const {user} = req
            
            const projectRequests = await prisma.request.findMany({
                where: { 
                    role: {
                        post: {
                            project: {
                                id: parseInt(projectId)
                            }
                        }
                    }
                },
                include: {
                    userApplied: true,
                    role: true
                }
            })

            if (!projectRequests || projectRequests.length === 0)
                return res.status(404).json({"message": "no roles for the given project"})

            const userRequests = projectRequests.filter((request) => {
                return request.userApplied.fullName === user.fullName && request.status === 'accepted'
            })

            if (userRequests.length === 0)
                return res.status(500).json({"message": "user has no requests to given project"})

            const userRoles = userRequests.map((request) => {
                return request.role.position
            }).filter(Boolean)

            if (userRoles.length === 0)
                return res.status(404).json({"message": "user has no roles"})

            return res.status(200).json({Roles: userRoles})
        } catch(error) {
            console.error("Error fetching user roles:", error);
            return res.status(500).json({ "message": "An unexpected error occurred" });
        }
    }

    static async getProjectTeamProfileAvatars(req, res) {
        try {
            const {user} = req
            const {username, projectId} = req.params

            const team = await prisma.team.findFirst({
                where: {
                    project_id: parseInt(projectId)
                },
                include: {
                    members: {
                        include: {
                            profile: true
                        }
                    }
                }
            })

            if (!team)
                return res.status(404).json({"message": "team not found"})

            const profileAvatars = team.members.map((member) => {
                return member.profile?.image
            }).filter(Boolean)

            if (profileAvatars.length === 0)
                return res.status(404).json({"message": "no profile avatars found for team members"})

            return res.status(200).json({avatars: profileAvatars})
        } catch(error) {
            console.error("Error fetching Team Profile Pictures:", error)
            return res.status(500).json({"message": "An unexpected error occurred"})
        }
    }

    static async getUserProjectsRoles(req, res) {
        try {
            const {username, projectId} = req.params
            const {user} = req

            // sending the user role form the post if he is the owner
            const project = await prisma.project.findFirst({
                where: {
                    id: parseInt(projectId),
                    owner: {
                        fullName: user.fullName
                    }
                },
                include: {
                    post: true
                }
            })

            if (!project)
                return res.status(404).json({"message": "user have no project with given id"})
            
            return res.status(200).json({"role": project.post.myRole})

        } catch(error) {
            console.error(error)
            return res.status(500).json({"message": "An unexpected Error occur"})
        }
    }
}

module.exports = projectController