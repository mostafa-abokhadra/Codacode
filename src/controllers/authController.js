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
        let message = req.session.info
        req.session.info = null
        res.render('login', {message: message});
    }

    static async postSignup(req, res){
        const {fullName, email, password} = req.body
        try {
            let user = await prisma.user.findFirst({
                where: {email: email}
            })
            if (user) {
                req.session.info = "user already has an account, please login"
                return res.redirect('login');
            }
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
        passport.authenticate('google', async (err, googleUser, info) => {
            if (err) 
                return res.status(500).json({ error: 'Authentication failed. Please try again.'});
            if (!googleUser) 
                return res.status(401).json({ error: 'User not found or authentication denied.' });
            try {
                let user = await prisma.user.findFirst({
                    where: {email: googleUser.email}
                })
                if (!user) {
                    user  = await prisma.user.create({
                        data: {
                            email: googleUser.email,
                            password: await new Promise((resolve, reject) => {
                                bcrypt.hash(`google-${googleUser.displayName}`, process.env.SALT || 10, (error, hashed) => {
                                    if (error)
                                        return reject(error)
                                    resolve(hashed)
                                })
                            }),
                            fullName: googleUser.fullName
                        }
                    })
                }
                user = await utils.getUpdatedUser(user.email)
                if (user.hasOwnProperty("message")) {
                    return res.status(500).json({
                        "message": "an error occure while fetching updted user",
                        "info": user.message
                    })
                }
                req.logIn(user, (error) => {
                    if (error)
                        return res.status(500).json({ error: 'Login failed. Please try again.' });
                    const urlUserName = user.fullName.replaceAll(" ", '-')
                    res.redirect(`/${urlUserName}/dashboard`)
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
            res.clearCookie("sessionCookie")
            res.redirect("/")
        })
    }
}
module.exports = authController