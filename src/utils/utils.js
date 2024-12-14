const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

async function getUpdatedUser(email) {
    try {
        const user = await prisma.user.findFirst({
            where: {email},
            include: {
                profile: true,
                posts: {
                    include: {
                        roles: true
                    }
                },
                teams: true,
                messages: true,
                pending: true,
                Projects: true,
                assignedProjects: true
            }
        })
        if (!user)
            return {"message": "couldn't fetch user"}
        return user
    } catch(error) {
        return {"message": "an error occured", "error": error}
    }
}
async function deleteGarbageRequest(requestId) {
    try {
        const deleted = await prisma.request.delete({
            where: {id: parseInt(requestId)}
        })
        if (!deleted) {
            return {
                "error": "can't delete garbage request",
                "solve": "delete it mannually",
                "requestId": parseInt(requestId)
            }
        }
        return {
            "message": "garbage request deleted successfully",
            "problem": "update operation can't be done for role or user"
        }
    } catch(error) {
        return {
            "error": "an error has orccured, check the console" 
        }
    }
}
async function getSendToMeRequests(username) {
    try {
        const user = await prisma.user.findFirst({
                where: {fullName: username},
                include: {
                    posts: {
                        include: {
                            roles: {
                                include: {
                                    requests: {
                                        where: {
                                            status: {
                                                notIn: ["accepted", "rejected"]
                                            }
                                        },
                                        include: {
                                            userApplied: {
                                                select: {
                                                    id: true,
                                                }
                                            },
                                            role: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            if (!user)
                return {"error": "can't find user"}
            let requests = []
            for (let i = 0; i < user.posts.length; i++) {
                for (let j = 0; j < user.posts[i].roles.length; j++) {
                    for (let k = 0; k < user.posts[i].roles[j].requests.length; k++) {
                        requests.push(user.posts[i].roles[j].requests[k])
                    }
                }
            }
            return {
                "message": "requests retrieved successfully",
                "requests": requests
            }
    } catch(error) {
        console.log(error)
        return {"error": "an error occur in utils"}
    }
}
async function getPendingRequests(username) {
    try {
        const user = await prisma.user.findFirst({
            where: {fullName: username},
            include: {pending: true}
        })
        if (!user)
            return {"error": "can't find user"}
        return {"message": "pending requests retrieved successfully", pending: user.pending}
    } catch(error) {
        return {"error": "an error occured"}
    }
}

async function checkProjectStatus(postId) {
    try {
        const post = await prisma.post.findFirst({
            where: {
                id: parseInt(postId)
            },
            include: {
                project: true,
                roles: true
            }
        })
        if (!post)
            return {"error": "can't get post in utils"}
        let neededSum = 0;
        let acceptedSum = 0;
        for (let i = 0; i < post.roles.length; i++){
            neededSum += post.roles[i].needed
            acceptedSum += post.roles[i].accepted
        }
        if (neededSum === acceptedSum)
            return {"status": "completed"}
        return {"status": "waiting"}
    } catch(error) {
        console.log(error)
        return {"error": "server error in utils"}
    }
}
module.exports = {
    getUpdatedUser,
    deleteGarbageRequest,
    getSendToMeRequests,
    getPendingRequests,
    checkProjectStatus
}