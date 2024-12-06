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
                collabProjects: true,
                messages: true,
                groups: true,
                requests: true
            }
        })
        if (!user)
            return {"message": "couldn't fetch user"}
        const {password, ...userWithoutSensetiveData} = user
        return userWithoutSensetiveData
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
        console.log(error)
        return {
            "error": "an error has orccured, check the console" 
        }
    }
}
module.exports = {
    getUpdatedUser,
    deleteGarbageRequest
}