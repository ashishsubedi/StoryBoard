const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

const User = mongoose.model('users');

module.exports = function (passport) {

    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "/auth/google/callback",
            userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
            proxy: true // For heroku
        }, (accessToken, refreshToken, profile, done) => {

            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?sz'));

            const newUser = {
                google: {
                    id: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    image: image
                }
            };
            //CHECK FOR EXISTING USER

            User.findOne({
                'google.id': profile.id
            })
                .then(user => {
                    if (user) {
                        done(null, user);
                    } else {
                        new User(newUser)
                            .save()
                            .then(user => done(null, user))
                            .catch(err => console.log(err));
                    }
                })
                .catch(err=>{console.log(err)});
        })
    );

    passport.serializeUser((user,done)=>{
        done(null,user.google.id);
    });
    passport.deserializeUser((id,done)=>{
        User.findOne({
            'google.id': id
        }).then(user => done(null, user));
    });

}