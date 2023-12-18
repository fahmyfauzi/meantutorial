var User = require('../models/user.js');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jsonwebtoken');

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
  app.use(passport.initialize());
  // Initialize passport and use passport session middleware
  app.use(passport.session());

  // Serialize user to the session
  passport.serializeUser((user, done) => {
    token = jwt.sign({ username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    done(null, user.id); // Pass both user id and token
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Configure Facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email'],
      },
      async function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        console.log(`profile: ${profile._json.email}`);

        const user = await User.findOne({ email: profile._json.email }).select('username email password').exec();

        if (user && user !== null) {
          done(null, user);
        } else {
          done(null, false); // Pass false to indicate that no user was found
        }
      }
    )
  );

  // Define routes for Facebook authentication
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/facebook/' + token); // Use req.user.token to access the token
  });
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
};
