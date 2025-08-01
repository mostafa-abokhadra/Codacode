const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const crypto = require('crypto');
const {URL} = require('url')

async function getUpdatedUser(email) {
    try {
        const user = await prisma.user.findFirst({
            where: { email },
            select: {
                id: true,
                fullName: true,
                email: true,
                profile: true,
                pending: true,
                posts: {
                    include: {
                        roles: {
                            include: {
                                requests: true
                            }
                        }
                    }
                },
                Projects: {
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
                },
                assignedProjects: {
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
                },
                GitHub: true,
            }
        });
        
        if (!user)
            return {"error": "couldn't fetch user"}
        if (user.GitHub)
            user.GitHub = true
        const urlUserName = user.fullName.replaceAll(" ", '-')
        user.urlUserName = urlUserName
        return user
    } catch(error) {
        console.log("in utils: ", error)
        return {"error": "an error occured", "error": error}
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
async function getSendToMeRequests(userId) {
    try {
        const user = await prisma.user.findFirst({
                where: {id: userId},
                include: {
                    posts: {
                        include: {
                            roles: {
                                include: {
                                    requests: {
                                        where: {
                                            // status: {
                                            //     notIn: ["accepted", "rejected"]
                                            // }
                                            show: true
                                        },
                                        include: {
                                            userApplied: {
                                                select: {
                                                    id: true,
                                                    fullName: true,
                                                    profile: {
                                                        select: {
                                                            image: true
                                                        }
                                                    }
                                                }
                                            },
                                            role: {
                                                include: {
                                                    post: true
                                                }
                                            }
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
async function getPendingRequests(userId) {
    try {
        const user = await prisma.user.findFirst({
            where: {id: userId},
            include: {pending:{
                include: {
                    role: {
                        include: {
                            post: true
                        }
                    }
                }
            }}
        })
        if (!user)
            return {"error": "can't find user"}
        return {"message": "pending requests retrieved successfully", pending: user.pending}
    } catch(error) {
        console.log(error)
        return {"error": "an error occured", error: error}
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

// Encrypt function
async function encryptToken(token) {
    require('dotenv').config(); // Load environment variables from .env file

    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Convert hex string to Buffer
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');   // Convert hex string to Buffer

    const cipher = crypto.createCipheriv(process.env.CRYPTO_ALGORITHM, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Decrypt function
async function decryptToken(encryptedToken) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); 
    const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');   
    const decipher = crypto.createDecipheriv(process.env.CRYPTO_ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


const addCollaborator = async (ownerUsername, inviteeUsername, ownerToken, repo) => {

    try {
        const response = await fetch(
            `https://api.github.com/repos/${ownerUsername}/${repo}/collaborators/${inviteeUsername}`, {
            method: 'PUT',
            headers: {
                Authorization: `token ${ownerToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ permission: 'push' }) // Optional permission
        });
        const data = await response.json()
        if (!response.ok) 
            return {"error": "an error occured while sending collab request", data: data}
        return {"info": "collab request sent successfully", data: data}
    } catch(error) {
        return {"github api error": error}
    }
};

module.exports = {
    getUpdatedUser,
    deleteGarbageRequest,
    getSendToMeRequests,
    getPendingRequests,
    checkProjectStatus,
    encryptToken,
    decryptToken,
    addCollaborator,
}