const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

async function getUpdatedUser(email) {
    try {
        const user = await prisma.user.findFirst({
            where: {email},
            include: {
                profile: true,
                posts: {
                    roles: true
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
module.exports = {
    getUpdatedUser,
}