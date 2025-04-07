const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const upload = require('../config/multer')
const multer = require('multer')
const path = require('path')
const { profile } = require('console')
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

}

module.exports = portfolioController