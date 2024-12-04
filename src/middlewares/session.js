const session = require('express-session')
module.exports = session({
    name: 'sessionCookie',
    secret: process.env.SESSION_SECRET || "messi",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === "production" ? true : false,
        // sameSite: 'strict',
        // sameSite: 'none',
        // sameSite: 'lax',
        sameSite: process.env.NODE_ENV === "production" ? 'lax' : 'Lax',
        httpOnly: true,
        maxAge:  24 * 60 * 60 * 1000 // one day
    }
});