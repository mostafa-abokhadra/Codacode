const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const profilePictureUpload = require('../config/multer/multerPortfolioPictures')
const projectPrictureUpload = require('../config/multer/multerProjectsPhotos')
const multer = require('multer')
const path = require('path')

class portfolioController {
    // creation of profile is during signup

    static async getPortfolio(req, res) {
        try {
            const portfolio = await prisma.profile.findFirst({
                where: {
                    user: {
                        id: parseInt(req.params.user_id)
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
        profilePictureUpload.single('portfolio-image')(req, res, async function(err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: "Multer error occurred", details: err.message });
            } else if (err) {
                return res.status(500).json({ error: "Unknown error occurred", details: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: "No file profilePicture Uploaded" });
            }
           // console.log(req.file)
        // console.log(req.file.filename)
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
            message: "File profilePictureUploaded successfully",
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
        projectPrictureUpload.single('project-image')(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: "Multer error occurred", details: err.message });
            } else if (err) {
                return res.status(500).json({ error: "Unknown error occurred", details: err.message });
            }

            try {
                if (!req.file) {
                    return res.status(400).json({ error: "No file for project photo has uploaded" });
                }
                
                const newExperience = await prisma.portfolioProject.create({
                    data: {
                        profile_id: req.user.profile.id,
                        title: req.body.experienceTitle,
                        description: req.body.experienceDescription,
                        link: req.body.experienceLink,
                        image: path.join('/projectPhoto', req.file.filename)  
                    }
                })
                if (!newExperience) {
                    return res.status(500).json({"info": `can't create new experience`})
                }
                return res.status(200).json({ message: "Portfolio experience updated successfully" , data: newExperience});
            } catch (error) {
                console.error('Error handling profilePictureUploaded data:', error);
                return res.status(500).json({ error: "Internal server error", details: error.message });
            }
        });
    }
    
}

module.exports = portfolioController