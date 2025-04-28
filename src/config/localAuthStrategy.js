const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const utils = require('../utils/utils');

passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    },
    async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {email},
                select: {
                    password: true
                }
            })
            if (!user)
                return done(null, false, {"message": "username or email is wrong"})
            const validatePassword = await bcrypt.compare(password, user.password)
            if (!validatePassword) {
                return done(null, false, {message: "wrong password or email"})
            }
            let updatedUser = await utils.getUpdatedUser(email)
            if (updatedUser.hasOwnProperty("error")) {
                return done(null, false, {message: "email or password is wrong"})
            }
            return done(null, updatedUser)
        } catch(error) {
            return done(null, false, {message: "an error occured"})
        }
}))

passport.serializeUser(async (user, done) => {
    process.nextTick(async function() {
        done(null, user);
    });
})

passport.deserializeUser(async (user, done) => {
    try {
        process.nextTick(async function() {
            const updatedUser = await utils.getUpdatedUser(user.email)
            return done(null, updatedUser);
        });
    } catch(error) {
        return done(error, null)
    }
})
module.exports = passport