const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

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

    // static async updatePortfolioAbout(req, res) {
    //     try {
    //         const {name, tagline, about, gender} = req.body
    //         const  updatedPortfolio = await prisma.profile.update({
    //             where: {
    //                 user_id: req.user.id
    //             },
    //             data: {
    //                 name: name,
    //                 tagline: tagline,
    //                 about: about,
    //             }
    //         })
    //         if (!updatedPortfolio)
    //             return res.status(500).json({"info": `can't update user profile`})
            
    //         res.status(200).json({
    //             success: true,
    //             message: "Portfolio updated successfully",
    //             data: updatedPortfolio,
    //         });
    //     } catch(error) {
    //         console.error(`An Unexpected Error Occur: `, error)
    //         return res.status(500).json({"Error": "Server Error"})
    //     }
    // }
    static async editPortfolio(req, res) {
        try {
            return res.render('editPortfolio')
        } catch(error) {
            console.error('An Unexpected Error has Occured: ', error)
            return res.status(500).json({"Error": "Server Error"})
        }
    }
}

module.exports = portfolioController