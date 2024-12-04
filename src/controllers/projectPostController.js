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

            const {username} = req.param

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

    static async getPostById(req, res) {
        try {

            const {username, projectId} = req.params

            const project = await prisma.post.findFirst({
                where: {
                    user: {
                        fullName: username
                    },
                    id: parseInt(projectId)
                }
            })

            if (!project)
                return res.status(403).json({"message": "no project exist with given id for the given user"})

            return res.status(200).json({
                "message": "project retrieved scucessfully",
                project: project
            })
        } catch(error) {

            console.log(error)
            return res.status(500).josn({"message": "an error occured"})
        }
    }

    static async updatePost(req, res) {
        try {
            const { username, projectId } = req.params
            const { title, description, repo, roles } = req.body

            // getting the post to be updated
            const post = await prisma.post.findFirst({
                where: {
                    user: {
                        fullName: username
                    },
                    id: parseInt(projectId),
                },
                include: {
                    roles: true,
                    user: true
                }
            })

            if(!post)
                return res.status({"message": "post don't exist for the user"})

            // create the new roles
            let createdRoles = []

            for (let i = 0; i < roles.length; i++) {
                let createRole = await prisma.role.create({
                    data: {
                        position: roles[i].role,
                        needed: roles[i].no,
                        post: {
                            connect: {
                                id: post.id
                            }
                        },
                    }
                })
                if (createRole) {
                    createdRoles.push(createRole)
                    continue
                } else {
                    // if one role hasn't been created successfully for any reason
                    // the whole new roles will be deleted because in this case
                    // the post roles are not complete, so can't associate some roles
                    // to the project without the remaining ones that couldn't be created
                    if (createdRoles) {
                        for (let i = 0; i < createdRoles.length; i++) {
                            const deletedRole = await prisma.role.delete({
                                where: {
                                    id: createdRoles[i].id
                                }
                            })
                            if (!deletedRole) {
                                return res.status(500).json({
                                    "message": "can't update post",
                                    "problem": "some roles created but not all of them",
                                    "solve": "delete created roles manually",
                                    "rolesToBeDeletedManually": createdRoles
                                })
                            }
                        }
                    }
                    return res.status(500).json({"message": "couldn't create a new role"})
                }
            }
            // updating the post before deleting the old roles
            // because if any problems happend during update operation
            // the post will remain as it old version
            const updatedPost = await prisma.post.update({
                where: {
                    id: parseInt(projectId)
                },
                data: {
                    title: title,
                    content: description,
                    repo: repo,
                    updatedAt: new Date(),
                }
            })
            if (!updatedPost)
                return res.status(500).json({"message": "can't update post"})

            // post is updated successfully
            // so delete older roles associated with it
            for(let i = 0; i < post.roles.length; i++){
                let role = await prisma.role.delete({
                    where: {
                        id: post.roles[i].id
                    }
                })
                if (!role)
                    return res.status(500).json({"message": "can't delete old roles"})
            }

            const user = await utils.getUpdatedUser(post.user.email)
            return res.status(200).json({
                "message": "project updated successfully",
                user: user
            })
        } catch(error) {

            console.log(error)
            return res.status(500).json({"message": "an error occured"})
        }
    }

    static async deletePost(req, res) {
        try {

            const {username, projectId} = req.params

            const post = await prisma.post.delete({
                where: {
                    id: parseInt(projectId),
                    user: {
                        fullName: username
                    }
                },
                include: {user: true}
            })

            if (!post)
                return res.status(500).json({"message": "cant' delete post"})

            const user = await utils.getUpdatedUser(post.user.email)
            return res.status(200).json({
                "message": "post deleted successfully",
                user: user
            })

        } catch(error) {
            
            console.log(error)
            return res.status(500).json({"message": "an error occured"})
        }
    }
}

module.exports = projectPostController