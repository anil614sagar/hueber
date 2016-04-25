// config/passport.js

// load all the things we need
var OAuth2Strategy = require('passport-oauth2');
// Loading nconf middleware - Used to store, access configurations of webapp
var nconf = require('nconf');

// load up the user model
var User = require('../app/models/user');


// Load Auth Configurations
nconf.add('auth', { type: 'file', file: './config/auth.json' });


module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  // used to deserialize the user
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new OAuth2Strategy({
      authorizationURL: 'https://login.uber.com/oauth/v2/authorize',
      tokenURL: 'https://login.uber.com/oauth/v2/token',
      clientID: 'XXXXXX',
      clientSecret: 'XXXXX',
      callbackURL: "http://localhost:3000/auth/uber/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
      console.log(accessToken)
      console.log(refreshToken)
      console.log(profile)
      var user = {}
      user.token = accessToken
      user.refreshToken = refreshToken
      return cb(null, user);
      //User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      //  return cb(err, user);
      //});
    }
  ));

};
