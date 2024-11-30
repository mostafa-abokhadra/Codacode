const session = require('express-session')
module.exports = session({
    name: 'sessionCookie',
    secret: process.env.SESSION_SECRET || "messi",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge:  24 * 60 * 60 * 1000 // one day
    }
});