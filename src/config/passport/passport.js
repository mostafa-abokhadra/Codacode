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
            const user = await prisma.user.findUnique({
                where: {id: theUser.id},
                select: {
                    id: true,
                    fullName: true,
                }
            });
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