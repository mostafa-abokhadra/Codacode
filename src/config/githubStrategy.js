const passport = require("passport")
const GitHubStrategy = require("passport-github2").Strategy

passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:8080/auth/github/redirect",
    },
    function(accessToken, freshToken, profile, done) {
        process.nextTick(function() {
            try {
                const user = {
                    username: profile.username,
                    token: accessToken
                }
                return done(null, user)
            } catch(error) {
                return done(null, error)
            }
        })
    }
))

module.exports = passport