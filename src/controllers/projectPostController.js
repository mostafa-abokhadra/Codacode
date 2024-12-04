const {PrismaClient} = require('@prisma/client')
const { create } = require('domain')
const prisma = new PrismaClient()
const utils = require("../utils/utils")

class projectPostController {
    static async createPost(req, res) {
        try {
            const { title, description, repo, roles} = req.body

            const user = await prisma.user.findUnique({
                where: {fullName: req.params.username},
                include: {posts: true}
            })

            if (!user)
                return res.status(500).json({"messasge": "can't fetch user from database"})

            const projectPost = await prisma.post.create({
                data: {
                    title: title,
                    content: description,
                    repo: repo,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    user: {
                        connect: {id: user.id}
                    }
                    // user_id: user.id
                }
            })
            if (!projectPost)
                return res.status(500).json({"message": "can't create a post"})

            let createdRoles = [] // to store all roles created

            for(let i = 0; i < roles.length ; i++){

                let role = roles[i].role
                let no = roles[i].no

                const createRole = await prisma.role.create({
                    data: {
                        position: role,
                        needed: no,
                        post: {
                            connect: {id: projectPost.id}
                        }
                        // post_id: projectPost.id
                    }
                })

                if (createRole) {
                    createdRoles.push(createRole)
                    continue
                }

                if (!createRole) {

                    if (createdRoles) {

                        // checking if there is some role created and then an error occur for the subsequent roles
                        // in this case i will delete all roles created for this post from the database
                        // cause post project is not complete this way and already created roles don't belong to any post

                        for(let i = 0; i < createdRoles.length; i++)
                        {
                            let deletedPost = await prisma.role.delete({
                                where: {id: createdRoles[i].id}
                            })

                            if (!deletedPost)
                                return res.status(500).json({
                            "message": "can't delete unNeeded roles",
                            "solve": "clean it manually",
                            "postToBeDeleted": createdPost
                            })

                        }
                    }

                    return res.status(500).json({"message": "can't create a role"})
                }
            }

            const updatedUser = await utils.getUpdatedUser(user.email)
            return res.status(200).json({
                "message": "post created successfully",
                "user": updatedUser
            })

        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error occured"})
        }
    }

    static async getPosts(req, res) {
        try {
            const username = req.param.username
            const posts = await prisma.post.findMany({
                where: {
                    user: {
                        fullName: username
                    }
                }
            })
            if (!posts)
                return res.status(203).json({"message": "user don't have any posts yet"})
            return res.status(200).json({"message": "posts retrieved successfully", posts: posts})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error occured"})
        }
    }
}
module.exports = projectPostController