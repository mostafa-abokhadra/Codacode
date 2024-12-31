const {PrismaClient} = require('@prisma/client')
const { create } = require('domain')
const prisma = new PrismaClient()
const utils = require("../utils/utils")

class projectPostController {
    static async createPost(req, res) {
        try {
            const { title, description, langPref, yourRole, repo} = req.body
            let {roles} = req.body;
            if (typeof roles === 'string') {
                roles = JSON.parse(roles)
            }
            const user = await prisma.user.findUnique({
                where: {fullName: req.user.fullName},
                include: {posts: true}
            })
            if (!user)
                return res.status(500).json({"messasge": "can't fetch user from database"})
            const projectPost = await prisma.post.create({
                data: {
                    title: title,
                    description: description,
                    repo: repo,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    languagePreferences: langPref,
                    myRole: yourRole,
                    user: {
                        connect: {id: user.id}
                    }
                }
            })
            if (!projectPost)
                return res.status(500).json({"message": "can't create a post"})
            let createdRoles = [] // to store all roles created

            for(let i = 0; i < roles.length ; i++){

                let role = roles[i].role
                let numberNeeded = roles[i].numberNeeded

                const createRole = await prisma.role.create({
                    data: {
                        position: role,
                        needed: parseInt(numberNeeded),
                        post: {
                            connect: {id: projectPost.id}
                        },
                        status: "available"
                    }
                })

                if (!createRole) {
                    if (createdRoles) {
                        // checking if there is some role created and then an error occur for the subsequent roles
                        // in this case i will delete all roles created for this post from the database
                        // cause project post is numberNeededt complete this way and already created roles don't belong to any post

                        for(let i = 0; i < createdRoles.length; i++)
                        {
                            let deletedRole = await prisma.role.delete({
                                where: {id: createdRoles[i].id}
                            })

                            if (!deletedRole)
                                return res.status(500).json({
                            "message": "can't delete unNeeded roles",
                            "solve": "clean it manually",
                            "roles to be deleted": createdRoles
                            })
                        }
                    }
                    return res.status(500).json({"message": "can't create roles"})
                }
                createdRoles.push(createRole)
            }
            const {password, ...updatedUser} = await utils.getUpdatedUser(user.email)
            // return res.redirect(307, `/${req.params.username}/posts/${projectPost.id}/projects`)
            return res.status(200).json({
                "message": "post created successfully",
                "user": updatedUser,
                post: projectPost
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
                        fullName: req.user.fullName
                    }
                },
                include: {
                    roles: true,
                    user: true
                }
            })
            if (!posts)
                return res.status(203).json({"message": "user don't have any posts yet"})
            // return res.render('userPosts', {user: req.user, posts: posts})
            return res.status(200).json({"posts": posts})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error occured"})
        }
    }

    static async getPostById(req, res) {
        try {
            const {username, postId} = req.params
            const post = await prisma.post.findFirst({
                where: {
                    user: {
                        fullName: username
                    },
                    id: parseInt(postId)
                }
            })
            if (!post)
                return res.status(403).json({"message": "numberNeeded post exist with given id for the given user"})
            return res.status(200).json({
                "message": "posts retrieved scucessfully",
                post: post
            })
        } catch(error) {
            return res.status(500).josn({"message": "an error occured"})
        }
    }

    static async updatePost(req, res) {
        try {
            const { username, postId } = req.params
            const { title, description, repo, roles } = req.body
            // getting the post to be updated
            const post = await prisma.post.findFirst({
                where: {
                    user: {
                        fullName: username
                    },
                    id: parseInt(postId),
                },
                include: {
                    roles: true,
                    user: true,
                    project: true
                }
            })
            if(!post)
                return res.status({"message": "post don't exist for the user"})
            if (post.project.status == "workOn")
                return res.status(401).json({"message": "project is already in action"})
            // create the new roles
            let createdRoles = []
            for (let i = 0; i < roles.length; i++) {
                let createRole = await prisma.role.create({
                    data: {
                        position: roles[i].role,
                        needed: roles[i].numberNeeded,
                        post: {
                            connect: {
                                id: post.id
                            }
                        },
                    }
                })
                if (!createRole) {
                    // if one role hasn't been created successfully for any reason
                    // the whole new roles will be deleted because in this case
                    // the post roles are numberNeededt complete, so can't associate some roles
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
                                    "problem": "some roles created but numberNeededt all of them",
                                    "solve": "delete created roles manually",
                                    "rolesToBeDeletedManually": createdRoles
                                })
                            }
                        }
                    }
                    return res.status(500).json({"message": "couldn't create new post roles"})
                }
                createdRoles.push(createRole)
            }
            // updating the post before deleting the old roles
            // because if any problems happend during update operation
            // the post will remain as it old version
            const updatedPost = await prisma.post.update({
                where: {
                    id: parseInt(postId)
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
                if (!role) {
                    return res.status(500).json({
                        "message": "can't delete old roles but new roles are added",
                        "solve": "delete manually",
                        "old roles to delete": post.roles
                    })
                }
            }
            const user = await utils.getUpdatedUser(post.user.email)
            return res.status(200).json({
                "message": "post updated successfully",
                user: user
            })
        } catch(error) {
            console.log(error)
            return res.status(500).json({"message": "an error occured"})
        }
    }

    static async deletePost(req, res) {
        try {
            const {username, postId} = req.params
            const post = await prisma.post.delete({
                where: {
                    id: parseInt(postId),
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
            return res.status(500).json({"message": "an error occured"})
        }
    }
}

module.exports = projectPostController