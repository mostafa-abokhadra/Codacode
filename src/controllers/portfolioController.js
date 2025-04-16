const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const upload = require('../config/multer')
const multer = require('multer')
const path = require('path')

class portfolioController {
    // creation of profile is during signup

    static async getPortfolio(req, res) {
        try {
            const portfolio = await prisma.profile.findFirst({
                where: {
                    user: {
                        fullName: req.params.username
                    }
                },
                include: {
                    education: true,
                    skills: true,
                    projects: true,
                    contact: {
                        include: {
                            number: true
                        }
                    }
                }
            })
            if (!portfolio)
                return res.status(404).json({"info": "portfolio not found"})
            return res.status(200).json({portfolio: portfolio})
        } catch(error) {
            console.error(error)
            return res.status(500).json({"Error": "Server Error"})
        }
    }

    static async updatePortfolioImage(req, res) {
        upload.single('portfolio-image')(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: "Multer error occurred", details: err.message });
            } else if (err) {
                return res.status(500).json({ error: "Unknown error occurred", details: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const updateImage = await prisma.user.update({
                where: {fullName: req.user.fullName},
                data: {
                    profile: {
                        update: {
                            image: path.join('/avatars', req.file.filename)  
                        }
                    }
                },
                include: {
                    profile: true
                }
            })
            if (!updateImage)
                return res.status(403).json({info: "can't update image"})
            return res.status(200).json({
                message: "File uploaded successfully",
                path: updateImage.profile.image
            });
        })
    }
    static async updatePortfolioAbout(req, res) {
        try {
            const {name, tagline, about, gender} = req.body
            const  updatedPortfolio = await prisma.profile.update({
                where: {
                    user_id: req.user.id
                },
                data: {
                    name: name,
                    tagline: tagline,
                    about: about,
                }
            })
            if (!updatedPortfolio)
                return res.status(500).json({"info": `can't update user profile`})
            
            res.status(200).json({
                success: true,
                message: "Portfolio updated successfully",
                data: updatedPortfolio,
            });
        } catch(error) {
            console.error(`An Unexpected Error Occur: `, error)
            return res.status(500).json({"Error": "Server Error"})
        }
    }
    static async updatePortfolioEducation(req, res) {
        try {
            const {course, degree, organization, startDate, endDate} = req.body
            const newEducation = await prisma.education.create({
                data: {
                    course,
                    degree,
                    organization,
                    startDate: new Date(startDate.year, startDate.month - 1, startDate.day),
                    endDate: new Date(endDate.year, endDate.month - 1, endDate.day),
                    profile: {
                        connect: {
                            user_id: req.user.id
                        }
                    }
                }
            });
            if (!newEducation)
                return res.status(500).json({'info': 'can not create new education'})
            return res.status(201).json({"info": "education created successfully", education: newEducation})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"info": "server error", error: error})
        }
    }

    static async updatePortfolioExperience(req, res) {
        try {
            console.log(req.body)
            // console.log(req.file)
            // console.log(req.files[0])
            // const {projectTitle, projectDescription, projectLink} = req.body
            return res.status(200).json({experiences: {'1': 'ok'}})
        } catch(error) {
            console.log(error)
            return res.status(500).json({'info': 'an Error'})
        }
    }
}

module.exports = portfolioController