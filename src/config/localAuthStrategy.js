const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const utils = require('../utils/utils')
const { updateLanguageServiceSourceFile } = require('typescript');

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        let user = await prisma.user.findFirst({
            where: {email},
            include: {
                profile: true,
                posts: true,
                teams: true,
                collabProjects: true,
                messages: true,
                groups: true,
                requests: true
            }
        })
        if (!user) {
            return done(null, false, {message: "email or password is wrong"})
        }
        const validatePassword = await bcrypt.compare(password, user.password)
        if (!validatePassword) {
            return done(null, false, {message: "wrong password or email"})
        }
        user = await utils.getUpdatedUser(email)
        return done(null, user)
    } catch(error) {
        console.log(error)
        return done(null, false, {message: "an error occured"})
    }
}))

passport.serializeUser((user, done) => {
    process.nextTick(function() {
        done(null, user);
    });
})

passport.deserializeUser(async (user, done) => {
    try {
        process.nextTick(function() {
            return done(null, user);
        });
    } catch(error) {
        return done(error, null)
    }
})
module.exports = passport