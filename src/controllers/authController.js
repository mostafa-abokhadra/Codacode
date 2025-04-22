const passport = require("../config/localAuthStrategy")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const utils  = require("../utils/utils")
const passportGithub = require("../config/githubStrategy")
const profileController = require('../controllers/projectController')

class authController {

    static async getSignup(req, res){
        return res.render('signup')
    }

    static async getLogin(req, res){
        let message = req.session.info
        req.session.info = null
        return res.render('login', {message: message});
    }

    static async  checkFullNameAvailability(req, res) {
        try {
            let availablity = true
            const user = await prisma.user.findFirst({
                where: {fullName: req.body.fullName}
            })
            if (user)
                availablity = false
            return res.status(200).json({availablity: availablity})
        } catch(error) {
            return res.status(500).json({'info': 'An Error while validating fullName presence'})
        }
    }

    static async  checkEmailAvailability(req, res) {
        try {
            let availablity = true
            const user = await prisma.user.findFirst({
                where: {email: req.body.email}
            })
            if (user)
                availablity = false
            return res.status(200).json({availablity: availablity})
        } catch(error) {
            return res.status(500).json({"info": 'an error while checking email presence'})
        }
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
                        bcrypt.hash(password, parseInt(process.env.HASHING_SALT) || 10, (error, hashed) => {
                            if (error)
                                return reject(error)
                            resolve(hashed)
                        } )
                    }),
                    profile: {
                        create: {
                                image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010',
                        }
                    }
                }
            })
            user = await utils.getUpdatedUser(email)
            if (user.hasOwnProperty('error')) {
                return res.status(500).json({
                    "info": "an error occured while fetching updated user",
                    "message": user.message
                })
            }
            // const {GitHub, ...theUser} = user
            req.logIn(user, (error) => {
                if (error){
                    return res.status(500).json({"message": "error while login user"})
                }
                const urlUserName = user.fullName.replaceAll(" ", '-')
                req.user.urlUserName = urlUserName
                return res.redirect("/auth/github")
                // return res.redirect(`/${req.user.urlUserName}/dashboard`)
            })
        } catch(error) {
            console.log(error)
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
            // const flag = user.GitHub? true: false;
            // const {GitHub, ...theUser} = user
            req.logIn(user, (error) => {
                if (error) {
                    return res.status(500).json({"message": "error in login"})
                }
                const urlUserName = user.fullName.replaceAll(" ", '-')
                req.user.urlUserName = urlUserName
                if (!user.GitHub)
                    return res.redirect('/auth/github')
                return res.redirect(`/${req.user.urlUserName}/dashboard`)
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
                return res.redirect("/auth/login")
                // return res.status(401).json({ error: 'User not found or authentication denied.' });
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
                            fullName: googleUser.fullName,
                            profile: {
                                create: {
                                    image: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010',
                                }
                            }
                        }
                    })
                }
                user = await utils.getUpdatedUser(user.email)
                if (user.hasOwnProperty("error")) {
                    return res.status(500).json({
                        "message": "an error occure while fetching updted user",
                        "info": user.message
                    })
                }
                // const flag = user.GitHub? true: false;
                // const {GitHub, ...theUser} = user
                
                req.logIn(user, (error) => {
                    if (error)
                        return res.status(500).json({ error: 'Login failed. Please try again.' });
                    const urlUserName = user.fullName.replaceAll(" ", '-')
                    req.user.urlUserName = urlUserName
                    if (!user.GitHub)
                        return res.redirect("/auth/github")
                    return res.redirect(`/${req.user.urlUserName}/dashboard`)
                });
            }catch(err){
                console.log(err)
                return res.status(500).json({"message": "an error has occured"})
            }   
        })(req, res, next);
        
    }

    static async getGitHubAuth(req, res, next) {
        return res.status(200).json({"message": "github auth page"})
    }

    static async getGitHubRedirect(req, res, next){
        passportGithub.authenticate('github', async(err, user, info)=> {
            try {
                if (!user) {
                    return res.redirect(`/${req.user.urlUserName}/dashboard`)
                }
                const encryptedToken = await utils.encryptToken(user.token)
                const encryptedGitHubUsername = await utils.encryptToken(user.username)
                const githubCredentials = await prisma.gitHubCredential.create({
                    data: {
                        user: {
                            connect: {
                                id: req.user.id
                            }
                        },
                        accessToken: encryptedToken,
                        githubUsername: encryptedGitHubUsername
                    }
                })
                if (!githubCredentials)
                    return res.status(500).json({"message": "can't save user github credentials"})
                req.user = {
                    ...req.user,
                    GitHub: true
                }
                req.logIn(req.user, (error) => {
                    if (error)
                        return res.status(500).json({"message": "can't login after github auth"})
                })
                return res.redirect(`/${req.user.urlUserName}/dashboard`)
            } catch(error) {
                console.log(error)
                return res.status(500).json({"'message": "an error has occured"})
            }
        })(req, res, next);
    }
    static async logout(req, res){
        req.logout((err) => {
            if (err) {
                return res.status(500).json({"message": "logout failed"})
            }
            res.clearCookie("codacodeCookie")
            return res.redirect("/")
        })
    }
}
module.exports = authController