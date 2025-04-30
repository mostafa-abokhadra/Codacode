const LocalStrategy = require('passport-local').Strategy;
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');


module.exports = (passport) => {
    passport.use('local-login', new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const user = await prisma.user.findUnique({ 
                    where: { email } 
                });
                if (!user) {
                    return done(null, false, { 
                        message: 'Incorrect email or password' 
                    });
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    return done(null, false, {
                        message: "Incorrect email or password"
                    });
                }
                return done(null, user);
            } catch (error) {
                console.error('Login error:', error);
                return done(error, false, {
                    message: "An error occurred during login"
                });
            }
        }
    ));
};
