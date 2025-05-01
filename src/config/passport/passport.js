const loginConfig = require('./local-login');
const signupConfig = require('./local-signup');
const githubConfig = require('./githubStrategy')
const googleConfig = require('./googleStrategy')
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = (passport) => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser(async (theUser, done) => {
        try {
            // for now this is the data that i want in req.user
            const user = await prisma.user.findUnique({
                where: {id: theUser.id},
                select: {
                    id: true,
                    fullName: true,
                    GitHub: true
                }
            });
            if (user.GitHub)
                user.GitHub = true
            else
                user.GitHub = false
            if (theUser.info)
                user.info = theUser.info
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    loginConfig(passport);
    signupConfig(passport);
    githubConfig(passport)
    googleConfig(passport)
}