const User = require('../models/user.js');
const session = require('express-session');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (app, passport) {
  // Set up session middleware
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

  // Initialize passport and use passport session middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Serialize user to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      consoele.log();
      const user = await User.findById({ _id: id });
      console.log(user);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Configure Facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      (accessToken, refreshToken, profile, done) => {
        // Fix the typo here
        console.log(profile);
        done(null, profile);
      }
    )
  );

  // Define routes for Facebook authentication
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/about' }));
  app.get('/auth/facebook', passport.authenticate('facebook'));
};
