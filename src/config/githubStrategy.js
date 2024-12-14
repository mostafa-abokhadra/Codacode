const passport = require("passport")
const GitHubStrategy = require("passport-github2").Strategy

passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/github/redirect"
    },
    function(accessToken, freshToken, profile, done) {
        process.nextTick(function() {
            try {
                console.log(profile)
                const user = {
                    email: profile.email,
                    username: profile.username
                }
                return done(null, user)
            } catch(error) {
                return done(error)
            }
        })
    }
))

module.exports = passport