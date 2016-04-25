var express  = require('express');
var morgan = require('morgan')
var bodyParser = require('body-parser')
var methodOverride = require('method-override');
var nconf = require('nconf');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var favicon = require('serve-favicon');

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv()
  .env()
  .use('file', { file: './config/server.json' });


// Creating our App with Express
var app      = express();

// Load Favicon
app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use('/bower_components',  express.static(__dirname + '/bower_components'))


// log every request to the console using morgan middleware
app.use(morgan('dev'));
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));
// parse application/json
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// Use MethodOverride - See http://stackoverflow.com/questions/8378338/what-does-connect-js-methodoverride-do for more explaination
app.use(methodOverride());
// read cookies (needed for auth)
app.use(cookieParser());

// required for passport
// set session secret
// Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. This is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie.
// Forces session to be saved even when unmodified.
app.use(session({secret: 'apigeeks',
  saveUninitialized: true,
  resave: true}));
// initialize
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());


// passport ==================================================
require('./app/passport')(passport); // pass passport for configuration

// routes ==================================================
require('./app/routes')(app, passport); // configure our routes

// listen (start app with node server.js) ======================================
app.listen(nconf.get('server:port'));
// Log that App is running on port 3000
console.log("App listening on port " + nconf.get('server:port'));

// expose app
exports = module.exports = app;