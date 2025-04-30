const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
    passport.use('google', new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/auth/google/redirect',
    }, function verify(accessToken, refreshToken, profile, cb) {
        try {
            const user = {
                email: profile.emails[0].value,
                fullName: profile.displayName
            };
            return cb(null, user);
        } catch(error) {
            return cb(error);
        }
    }))
}
