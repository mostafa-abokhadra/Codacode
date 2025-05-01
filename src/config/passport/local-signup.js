const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

module.exports = (passport) => {
        passport.use('local-signup', new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const existingUser = await prisma.user.findUnique({ where: { email } });
                if (existingUser)
                    return done(null, false, { message: 'Email is already taken' });
                const hashedPassword = await bcrypt.hash(
                        password, parseInt(process.env.HASHING_SALT) || 10);
                let newUser = await prisma.user.create({
                    data: {
                        email: email,
                        fullName: req.body.fullName,
                        password: hashedPassword,
                        profile: {
                            create: {
                                    image: '/imgs/User_default_Icon.png',
                            }
                        }
                    },
                    select: {
                        fullName: true,
                        id: true
                    }
                })
                return done(null, newUser)
            } catch(error) {
                return done(error)
            }
        }
    ))
}