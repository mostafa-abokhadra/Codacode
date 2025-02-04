const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

class portfolioController {
    // creation of profile is during signup

    static async getPortfolio(req, res) {
        try {
            const portfolio = await prisma.profile.findFirst({
                where: {id: req.user.id},
                include: {
                    education: true,
                    skills: true,
                    projects: true,
                    contact: true
                }
            })
            if (!portfolio)
                return res.status(404).json({"info": "portfolio not found"})
            return res.status(200).json({portfolio: portfolio})
        } catch(error) {
            console.log(error)
            return res.status(500).json({"Error": "Server Error"})
        }
    }
}

module.exports = portfolioController