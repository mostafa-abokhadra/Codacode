const passport = require("passport")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const utils  = require("../utils/utils")

class authController {

    static async getSignup(req, res){
        return res.render('signup')
    }    

    static async postSignup(req, res, next){
        passport.authenticate('local-signup', async (err, user, info) => {
            try {
                if (err || !user)
                    return res.status(500).json({'info': `can't create new user`})
                req.logIn(user, (err) => {
                    if (err)
                        return res.status(500).json({'info': `can't login new user to session`})
                    return res.status(200).json({'info': 'user created successfully', user: user})
                })
            } catch(error){
                console.log(error)
            }
        })(req, res, next)
    }

    static async alreadyAuthenticated(username) {
        try {
            const authenticatedUsers = await prisma.user.findMany({
                where: {
                    GitHub: {
                        isNot: null
                    }
                },
                include: {
                    GitHub: true
                }
            })
            if (authenticatedUsers.length === 0) 
                return 0
            for (const user of authenticatedUsers) {
                const githubUsername = await utils.decryptToken(user.GitHub.githubUsername)
                if (githubUsername === username) 
                    return 1;
            }
            return 0;
        } catch(error){
            console.log(error)
        } 
    }
    static async getGitHubRedirect(req, res, next){
        passport.authenticate('github', async(err, user, info)=> {
            try {
                if (err || !user)
                    req.user = {...req.user, info: 'error in github auth api call'}
                else if (await authController.alreadyAuthenticated(user.username))
                    req.user = {...req.user, info: `github account belongs to another user`}
                else {
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
                        }})
                    if (!githubCredentials)
                        req.user = {...req.user, info: `can't create github credentials`}
                }
                req.logIn(req.user, req.user, (err) => {
                    if (err)
                        return res.status(500).json({"info": `can't login github authenticated user`})
                    return res.redirect('/dashboard')
                })
            } catch(error) {
                console.log(error)
            }
        })(req, res, next);
    }

    
    static async getLogin(req, res){
        let message = req.session.info
        req.session.info = null
        return res.render('login', {message: message});
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

    static async getGoogleLogin(req, res, next) {
        passport.authenticate('google',  { scope: ['profile', 'email'] }, (err, user, info) => {
            console.log('from google controller', err, user, info)
            // return res.status(200).json({"message": "googleAuthConsentPage"})
        })(req, res, next)
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
    static async logout(req, res) {
        req.logout((err) => {
            if (err) {
                return res.status(500).json({"message": "logout failed"});
            }
            
            req.session.destroy(function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Session destruction failed' });
                }
                
                res.clearCookie('codacodeCookie', {
                    path: '/',
                    httpOnly: true,
                    // secure: process.env.NODE_ENV === 'production', // Should be enabled in production
                    // sameSite: 'lax' // Recommended for CSRF protection
                });
                
                return res.status(200).json({ 
                    success: true, 
                    message: 'Logged out successfully' 
                });
            });
        });
    }

    /////////////////
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
}


module.exports = authController