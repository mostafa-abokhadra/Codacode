const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const utils = require('../utils/utils')
class requestsController {

        static async getSendToMeRequests(req, res) {
        try {
            const sendToMe = await utils.getSendToMeRequests(req.user.id)
            if (sendToMe.hasOwnProperty("error"))
                return res.status(500).json(sendToMe)
            return res.render('requests', {requests: sendToMe, user: req.user})
            // return res.status(200).json(sendToMe)
        } catch(error) {
            console.log(error)
            return res.status(500).json({"meessage": "an error occured, check the console"})
        }
    }

        static async acceptRequest(req, res) {
        try {
            console.log('do i get here')
            const {user_id, request_id} = req.params
            const theRequest = await prisma.request.findFirst({
                where: {id: parseInt(request_id)},
                include: {
                    userApplied: true,
                    role: true
                }
            })
            if (!theRequest)
                return res.status(401).json({"message": "no request exist with given id"})
            const myRequests = await utils.getSendToMeRequests(req.user.id)
            if (myRequests.hasOwnProperty("error"))
                return res.status(500).json(myRequests)
            const isInRequests = myRequests.requests.some((request) => {
                return request.id === theRequest.id
            })
            if (!isInRequests)
                return res.status(403).json({"message": "request doesn't belong to user or already accepted or rejected"})
            if (theRequest.role.accepted === theRequest.role.needed)
                return res.status(403).json({"message": "role is already staisfied"})
            const request = await prisma.request.update({
                where: {id: parseInt(request_id)},
                data: {
                    status: "accepted"
                },
                include: {
                    userApplied: true,
                    role: { 
                        include: {
                                post: { 
                                    include: {
                                            project: {
                                                include: {
                                                    team: { include: { group: true } },
                                                    users: true
                                                }
                                            } 
                                    }
                                }
                            }
                        },
                    },})
            if (!request)
                return res.status(500).json({"message": "can't update request"})
            const updateTeam = await prisma.team.update({
                where: {id: request.role.post.project.team.id},
                data: {
                    members: {
                        connect: {id: request.userApplied.id}
                    }
                }
            })
            if (!updateTeam) {
                return res.status(500).json({
                    "message": "cant' update the team",
                    userId: request.userApplied.id,
                    teamIdToJoin: request.role.post.project.team.id
                })
            }
            const updateProject = await prisma.project.update({
                where: {id: request.role.post.project.id},
                data: {
                    users: {
                        connect: {id: request.userApplied_id}
                    }
                }
            })
            if (!updateProject) {
                return res.status(500).json({
                    "message": "can't udpate the project users",
                    solve: `add userId ${request.userApplied_id} to projectId ${request.role.post.project_id} users[]` 
                })
            }
            const updateRole = await prisma.role.update({
                    where: {id: request.role.id},
                    data: {
                        accepted: request.role.accepted + 1,
                        status: request.role.accepted + 1 === request.role.needed? "completed": "available"
                    }
                })
            if (!updateRole) {
                return res.status(500).json({
                    "message": "can't update role 'accepted' and 'status' values",
                    roleId: request.role_id,
                    accepted: `should be ${request.role.accepted + 1}`,
                    status: 'according to accepted value'
                })
            }
            // getting the sum of all roles accepted and needed if equal (project start)
            const checkCompletedTeam = await utils.checkProjectStatus(request.role.post.id)
            if (checkCompletedTeam.hasOwnProperty("error")) {
                return res.status(500).json(checkCompletedTeam)
            }
            if (checkCompletedTeam.status == "completed") {
                const updateProjectStatus = await prisma.project.update({
                    where: {id: request.role.post.project.id},
                    data: {
                        status: "completed"
                    }
                })
                if (!updateProjectStatus) {
                    return res.status(500).json({
                        "message": "can't update project state", project: req.post.project,
                        status: `should be ${checkCompletedTeam.status}`
                    })
                }
            }
            const ownerGithub = await prisma.gitHubCredential.findFirst({
                where: {
                    user: {
                        id: req.user.id
                    }
            }})
            const inviteeGithub = await prisma.gitHubCredential.findFirst({
                where: {
                    user: {
                        id: request.userApplied.id
                    }
                }
            })
            if(!ownerGithub || !inviteeGithub) {
                return res.status(403).json({
                    "message": "can't get github credentials",
                    "solve": `user with id [${req.user.id}] must send collab request to
                        user with id [${request.userApplied.id}] on project id [${request.role.post.project.id}]`
                })
            }
            const repo = request.role.post.repo.split('/')[4]
            const ownerToken = await utils.decryptToken(ownerGithub.accessToken)
            const ownerUsername = await utils.decryptToken(ownerGithub.githubUsername)
            const inviteeUsername = await utils.decryptToken(inviteeGithub.githubUsername)
            const result = await utils.addCollaborator(ownerUsername, inviteeUsername, ownerToken, repo)

            if (result.hasOwnProperty("error")) {
                return res.status(500).json({...result, "message": "ask project owner to add you to the project repo"})
            }
            const currentRequestsAfterAccept = await utils.getSendToMeRequests(req.user.id) 

            return res.status(200).json({
                "message": "you have accepted request successfully",
                "info": result.message,
                currentReqeusts: currentRequestsAfterAccept
            })
            
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured", error})
        }
    }

    static async rejectRequest(req, res) {
        try {
            const {user_id, request_id} = req.params
            const theRequest = await prisma.request.findFirst({
                where: {id: parseInt(request_id)},
                include: {
                    userApplied: true,
                    role: true
                }
            })
            if (!theRequest)
                return res.status(401).json({"message": "no request exist with given id"})
            const myRequests = await utils.getSendToMeRequests(req.user.id)
            if (myRequests.hasOwnProperty("error"))
                return res.status(500).json(myRequests)
            const isInRequests = myRequests.requests.some((request) => {
                return request.id === theRequest.id
            })
            if (!isInRequests)
                return res.status(401).json({"message": "request doesn't belong to user"})
            const request = await prisma.request.update({
                where: {id: parseInt(request_id)},
                data: {
                    status: "rejected"
                },
                include: {
                    userApplied: true,
                    role: {
                        include: {
                            post: {
                                include: {
                                    project: {
                                        include: {
                                            team: { include: { group: true } },
                                            users: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                },
            })
            if (!request)
                return res.status(500).json({"message": "can't update request", "status": "should be rejected"})
            const currentRequestsAfterReject = await utils.getSendToMeRequests(req.user.id) 
            return res.status(200).json({
                "message": "you have rejected request successfully",
                currentReqeusts: currentRequestsAfterReject
            })
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async postApplyRequest(req, res) {
        try {
            const {user_id, post_id, role_id} = req.params
            const role = await prisma.role.findFirst({
                where: {
                    id: parseInt(role_id), 
                    post_id: parseInt(post_id)
                },
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
                return res.status(400).json({"message": "can't find role"})
            if (role.post.user.id === req.user.id)
                return res.status(400).json({"message": "can't apply to your own porject"})
            const userApplied = await prisma.user.findFirst({
                where: {id: parseInt(user_id)}
            })
            if (!userApplied)
                return res.status(400).json({"message": "user not found"})
            let exist = false;
            for (let i = 0; i < role.requests.length; i++) {
                if (req.user.id === role.requests[i].userApplied_id) {
                    exist = true; break;
                }
            }
            if (exist)
                return res.status(400).json({"message": "user already have applied to this position"})
            const createRequest = await prisma.request.create({
                data: {
                    role: {
                        connect: {id: role.id}
                    },
                    userApplied: {
                        connect: {id: userApplied.id}
                    },
                    status: "waiting"
                }
            })
            if (!createRequest)
                return res.status(500).json({"message": "can't send a request"})
            const updateRole = await prisma.role.update({
                where: {id: role.id},
                data: {
                    // requests:{
                    //     connect: {
                    //         id: createRequest.id
                    //     }
                    // },
                    applied: parseInt(role.applied) + 1
                }
            })
            if (!updateRole) {
                // will delete the garbage request
                const deleteGarbageRequest = await utils.deleteGarbageRequest(createRequest.id)
                return res.status(500).json({"message": "can't update the role request"})
            }
            return res.status(201).json({
                "message": "request to role sent successfully",
                request: createRequest
            })
        } catch(error) {
            console.error(error)
            return res.status(500).json("an error occured, look in console")
        }
    }



    static async getPendingRequests(req, res) {
        try {
            const pending = await utils.getPendingRequests(req.user.id)
            if (pending.hasOwnProperty("error"))
                return res.status(500).json(pending)
            return res.render('pending', {user: req.user, pending: pending})
            // return res.status(200).json(pending)
        } catch(error) {
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async cancelRequest(req, res) {
        try {
            const {user_id, request_id} = req.params
            const checkRequest = await prisma.request.findFirst({
                where: {
                    id: parseInt(request_id),
                    userApplied_id: req.user.id,
                    status: 'waiting'
                }
            })
            if (!checkRequest)
                return res.status(403).json({"message": "request doesn't exist for given user or status cahnged"})
            const request = await prisma.request.delete({
                where: {
                    id: parseInt(request_id),
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
            return res.status(204).json({"message": "canceled successfully"})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    

    static async updateShowStatus(req, res) {
        try {
            const {user_id, request_id} = req.params
            const request = await prisma.request.update({
                where: {id: parseInt(request_id)},
                data: {
                    show: false
                }
            })
            if (!request)
                return res.status(500).json({"message": "couldn't update show field"})
            return res.status(200).json({"message": "show field updated successfully"})
        } catch(error) {
            console.log(error)
        }
    }
    static async updateShowInPending(req, res) {
        try {
            const {user_id, request_id} = req.params
            const request = await prisma.request.findFirst({
                where: {
                    id: parseInt(request_id),
                    userApplied: {
                        id: req.user.id
                    }
                }
            })
            if (!request)
                return res.status(500).json({"message": "can't update showInPending field"})
            const updateRequest = await prisma.request.update({
                where: { id: request.id },
                data: { showInPending: false }
            })
            if (!updateRequest)
                return res.status(500).json({"message": "can't update request showInPending"})
            return res.status(200).json({"message": "updated successfully"})
        } catch(error) {
            console.log(error)
        }
    }
}


module.exports = requestsController