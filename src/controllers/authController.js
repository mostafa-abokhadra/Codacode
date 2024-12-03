const passport = require("../config/localAuthStrategy")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const utils  = require("../utils/utils")
const { promises } = require("dns");

class authController {

    static async getSignup(req, res){
        res.render('signup')
    }

    static async getLogin(req, res){
        res.render('login')
    }

    static async postSignup(req, res){

        const {fullName, email, password} = req.body

        try {
            let user = await prisma.user.findFirst({
                where: {email: email}
            })

            if (user)
                return res.status(401).json({"message": "user already exist"})

            let newUser = await prisma.user.create({

                data: {
                    email: email,
                    fullName: fullName,
                    password: await new Promise((resolve, reject) => {
                        bcrypt.hash(password, process.env.SALT || 10, (error, hashed) => {
                            if (error)
                                return reject(error)
                            resolve(hashed)
                        } )
                    })
                }
            })

            user = await utils.getUpdatedUser(email)

            if (!user.hasOwnProperty('message')) {

                req.logIn(user, (error) => {
                    if (error){
                        return res.status(500).json({"message": "error while login user"})
                    }
                    const urlUserName = user.fullName.replaceAll(" ", '-')
                    res.redirect(`/${urlUserName}/dashboard`)
                })
            } else {
                return res.status(500).json({
                    "info": "an error occured while fetching updated user",
                    "message": user.message
                })
            }
        } catch(error) {
            return res.status(500).json({"message": "an error has occured"})
        }
    }

    static async postLogin(req, res, next){
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return res.status(500).json({"message": "server error"})
            }
            if (!user) {
                return res.status(401).json({message: info.message})
            }
            req.logIn(user, (error) => {
                if (error) {
                    return res.status(500).json({"message": "error in login"})
                }
                const urlUserName = user.fullName.replaceAll(" ", '-')
                res.redirect(`/${urlUserName}/dashboard`)
            });
        })(req, res, next)
    }

    static async getGoogleLogin(req, res) {
        return res.status(200).json({"message": "googleAuthConsentPage"})
    }

    static async redirectGoogle(req, res, next) {
        passport.authenticate('google', async (err, user, info) => {
            if (err) 
                return res.status(500).json({ error: 'Authentication failed. Please try again.' });
            if (!user) 
                return res.status(401).json({ error: 'User not found or authentication denied.' });
            try {
                const newUser = await prisma.user.findFirst({
                    where: {email: user.email}
                })
                let currentUser = {}
                if (newUser)
                    currentUser = await utils.getUpdatedUser(newUser.email)
                if (!newUser) {
                    currentUser = await prisma.user.create({
                        data: {
                            email: user.email,
                            password: await new Promise((resolve, reject) => {
                                bcrypt.hash(`google-${user.displayName}`, process.env.SALT || 10, (error, hashed) => {
                                    if (error)
                                        return reject(error)
                                    resolve(hashed)
                                })
                            }),
                            fullName: user.fullName
                        }
                    })
                    currentUser = await utils.getUpdatedUser(currentUser.email)
                }
                req.logIn(currentUser, (loginErr) => {
                    if (loginErr)
                        return res.status(500).json({ error: 'Login failed. Please try again.' });
                    const urlUserName = currentUser.fullName.replaceAll(" ", '-')
                    res.redirect(`/${urlUserName}/dashboard`);
                });
                
            }catch(err){
                return res.status(500).json({"message": "an error has occured"})
            }   
        })(req, res, next);
        
    }

    static async logout(req, res){
        req.logout((err) => {
            if (err) {
                return res.status(500).json({"message": "logout failed"})
            }
            res.clearCookie()
            res.redirect("/")
        })
    }
}
module.exports = authController