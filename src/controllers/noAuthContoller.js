const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const utils = require('../utils/utils')

class noAuthController {
    // static async getIdeas(req, res) {
    //     try {
    //         return res.render('ideasBank')
    //     } catch(error) {
    //         return res.status(500).json({"message": "an error has occured"})
    //     }
    // }
    static async getAbout(req, res) {
        try {
            return res.render('about')
        } catch(error) {
            return res.status(500).json({'info': 'an error occur while rendering tempelate'})
        }
    }

    static async getUserPortofolio(req, res) {
        try {
            return res.render('portofolio')
        } catch(error) {
            console.log(error)
            return res.status(500).json({"meessage": "an error has occurd"})
        }
    }

    static async getProjects(req, res) {
        try {
            const posts = await prisma.post.findMany({
                where: {
                    project: {
                        status: {
                            not: "completed"
                        }
                    }
                },
                include: {
                    roles: {
                        select: {
                            id: true,
                            position: true,
                            needed: true,
                            applied: true,
                            status: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            profile: {
                                select: {
                                    id: true,
                                    image: true,
                                }
                            }
                        }
                    }
                }
            })
            if (!posts)
                return res.status(203).json({"message": "no post to show"})

            if (req.user) {
                const pending = await utils.getPendingRequests(req.user.id)
                return res.render('projects', {posts: posts, user: req.user, pending: pending})
            }
            return res.render('projects', {posts: posts, user: "", pending: ""})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error has occured"})
        }
    }
}
module.exports = noAuthController
