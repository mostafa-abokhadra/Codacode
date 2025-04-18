const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const utils = require('../utils/utils')
const { checkExact } = require("express-validator")
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
                return res.status(404).json({"message": "can't find role"})
            if (role.post.user.id === req.user.id)
                return res.status(501).json({"message": "can't apply to your own porject"})
            const userApplied = await prisma.user.findFirst({
                where: {fullName: username}
            })
            if (!userApplied)
                return res.status(404).json({"message": "user wants to apply not found"})
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
            return res.status(201).json({
                "message": "request to role sent successfully",
                // user: updatedUser,
                request: createRequest
            })
        } catch(error) {
            console.error(error)
            return res.status(500).json("an error occured, look in console")
        }
    }

    static async getSendToMeRequests(req, res) {
        try {
            const sendToMe = await utils.getSendToMeRequests(req.user.fullName)
            if (sendToMe.hasOwnProperty("error"))
                return res.status(500).json(sendToMe)
            return res.render('requests', {requests: sendToMe, user: req.user})
            // return res.status(200).json(sendToMe)
        } catch(error) {
            return res.status(500).json({"meessage": "an error occured, check the console"})
        }
    }

    static async getPendingRequests(req, res) {
        try {
            const pending = await utils.getPendingRequests(req.user.fullName)
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
            const {username, requestId} = req.params
            const checkRequest = await prisma.request.findFirst({
                where: {
                    id: parseInt(requestId),
                    userApplied_id: req.user.id,
                    status: 'waiting'
                }
            })
            if (!checkRequest)
                return res.status(403).json({"message": "request doesn't exist for given user or status cahnged"})
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
            return res.status(204).json({"message": "canceled successfully"})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async acceptRequest(req, res) {
        try {
            const {username, requestId} = req.params
            const exist = await prisma.request.findFirst({
                where: {id: parseInt(requestId)},
                include: {
                    userApplied: true,
                    role: true
                }
            })
            if (!exist)
                return res.status(401).json({"message": "no request exist with give id"})
            const myRequests = await utils.getSendToMeRequests(req.user.fullName)
            if (myRequests.hasOwnProperty("error"))
                return res.status(500).json(myRequests)
            const isInRequests = myRequests.requests.some((item) => {
                return item.id === exist.id
            })
            if (!isInRequests)
                return res.status(403).json({"message": "request doesn't belong to user or already accepted or rejected"})
            if (exist.role.accepted === exist.role.needed)
                return res.status(403).json({"message": "role is already staisfied"})
            const request = await prisma.request.update({
                where: {id: parseInt(requestId)},
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
                                            team: {
                                                include: { 
                                                    group: true 
                                                }
                                            },
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
                return res.status(500).json({"message": "can't update request"})
            const updateTeam = await prisma.team.update({
                where: {id: request.role.post.project.team.id},
                data: {
                    members: {
                        connect: {id: request.userApplied.id}
                    }
                }
            })
            if (!updateTeam)
                return res.status(500).json({"message": "cant' update the team"})
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
            let role = {}
            if ((request.role.accepted + 1) === request.role.needed) {
                role = await prisma.role.update({
                    where: {id: request.role.id},
                    data: {
                        accepted: request.role.accepted + 1,
                        status: "completed"
                    }
                })
            } else {
                role = await prisma.role.update({
                    where: {id: request.role.id},
                    data: {
                        accepted: request.role.accepted + 1,
                    }
                })
            }
            if (!role)
                return res.status(500).json({"message": "can't update role", roleId: request.role_id})
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
                if (!updateProjectStatus)
                    return res.status(500).json({"message": "can't update project state", project: req.post.project})
            }
            const ownerGithub = await prisma.gitHubCredential.findFirst({
                where: {user_id: req.user.id}
            })
            const inviteeGithub = await prisma.gitHubCredential.findFirst({
                where: {user_id: request.userApplied.id}
            })
       
            if(!ownerGithub || !inviteeGithub)
                return res.status(403).json({"message": "can't get github credentials"})
            const repo = request.role.post.repo.split('/')[4]
            const ownerToken = await utils.decryptToken(ownerGithub.accessToken)
            const ownerUsername = await utils.decryptToken(ownerGithub.githubUsername)
            const inviteeUsername = await utils.decryptToken(inviteeGithub.githubUsername)
        

            const result = await utils.addCollaborator(ownerUsername, inviteeUsername, ownerToken, repo)
            console.log('after collab req', result)
            if (result.hasOwnProperty("error"))
                return res.json(500).json(result)
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
            const currentRequestsAfterAccept = await utils.getSendToMeRequests(req.user.fullName) 
            console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
            return res.status(200).json({
                "message": "you have accepted request successfully",
                "info": result.message,
                currentReqeusts: currentRequestsAfterAccept
            })
            
        } catch(error) {
            console.log('the error')
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async rejectRequest(req, res) {
        try {
            const {username, requestId} = req.params
            const exist = await prisma.request.findFirst({
                where: {id: parseInt(requestId)},
                include: {
                    userApplied: true,
                    role: true
                }
            })
            if (!exist)
                return res.status(401).json({"message": "no request exist with give id"})
            const myRequests = await utils.getSendToMeRequests(req.user.fullName)
            if (myRequests.hasOwnProperty("error"))
                return res.status(500).json(myRequests)
            const isInRequests = myRequests.requests.some((item) => {
                return item.id === exist.id
            })
            if (!isInRequests)
                return res.status(401).json({"message": "request doesn't belong to user"})
            const request = await prisma.request.update({
                where: {id: parseInt(requestId)},
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
                                            team: {
                                                include: { 
                                                    group: true 
                                                }
                                            },
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
                return res.status(500).json({"message": "can't find request"})
            const currentRequestsAfterReject = await utils.getSendToMeRequests(req.user.fullName) 
            return res.status(200).json({
                "message": "you have rejected request successfully",
                currentReqeusts: currentRequestsAfterReject
            })
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async updateShowStatus(req, res) {
        try {
            const {username, requestId} = req.params
            const request = await prisma.request.update({
                where: {id: parseInt(requestId)},
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
            const {username, requestId} = req.params
            const request = await prisma.request.findFirst({
                where: {
                    id: parseInt(requestId),
                    userApplied: {
                        fullName: req.user.fullName
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