// app/routes.js
var path = require('path');
var extend = require('util')._extend;
var request = require('request');

var Hue = require("node-hue-api");
var HueApi = Hue.HueApi;
var lightState = Hue.lightState;
var pulseInterval;
var hostname = "192.168.1.131",
  username = "e6bb9744b3c8af6d0479c212e4e17",
  userDescription = "hueber",
  state = lightState.create();

var hueAPI = new HueApi(hostname, username);
var statusPoll;
state = lightState.create().on().white(500, 100);



var offState = lightState.create().off();

var baseRed = 223;
var baseGreen = 255;
var baseBlue = 21;

var subtractor = 3;
var currentResponseTime;

var displayUserResult = function(result) {
  console.log("Created user: " + JSON.stringify(result));
};

var displayBridges = function(bridge) {
  console.log("Hue Bridges Found: " + JSON.stringify(bridge));
};

var displayError = function(err) {
  console.log(err);
};

var displayResult = function(result) {
  console.log(JSON.stringify(result, null, 2));
};

var updateHueLights = function(state) {
  hueAPI.setLightState(1, state).then(displayResult).fail(displayError).done();
};

var getSmoothedStateRed = function(progress){
  baseRed = baseRed - 30;

  console.log("R : " + baseRed + ", Progress : " + progress);

  return baseRed;
}
var getState = function(stateStr, r, g, b){
  if(stateStr === "on")
    return state.on().rgb(r, g, b);
  else
    return state.off().rgb(r, g, b);
};

var pulseState = function(stateStr, r, g, b){
  if(stateStr === "on")
    return state.on().rgb(r, g, b).alertLong();
  else
    return state.off().rgb(r, g, b).alertLong();
};


var getUberStatus = function(){
  if(!currentResponseTime) {
    currentResponseTime = responses.destination.eta;
  }

  if(currentResponseTime <= 0){
    updateHueLights(getState("on", 137, 0, 255));
    clearInterval(statusPoll);
  } else {
    currentResponseTime = currentResponseTime - subtractor;
    updateHueLights(getState("on", getSmoothedStateRed(subtractor), baseGreen, baseBlue));
  }
};




module.exports = function(app, passport) {

  // route to handle all angular requests
  app.get('/', function(req, res) {
    res.sendFile(path.resolve('public/views/landing.html'));
  });

  // user information api call
  app.get('/user', function(req, res) {
    if (req.isAuthenticated()) {
      res.json({'loginStatus' : true, 'response' : req.user});
    }
    else {
      res.json({'loginStatus' : false, 'response' : {}});
    }
  });

  // route for showing the profile page
  app.get('/profile', isLoggedIn, function(req, res) {
    console.log(req.user)
    res.sendFile(path.resolve('public/views/uber.html'));
  });

  // route for logging out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/uber', passport.authenticate('oauth2', {
    redirect_uri: 'http://localhost:3000/auth/uber/callback',
    scope: 'profile request',
    state: '3(#0/!~',
    response_type: 'code'
  }));

  app.get('/auth/uber/callback',
    passport.authenticate('oauth2', {
      successRedirect : '/profile',
      failureRedirect : '/'
    }));

  app.get('/hueber/v1/user/me', function(req, res) {
    console.log(req.user.token)
    getUserDetails(req.user.token, function(err, response) {
      res.json(JSON.parse(response))
    });
  })

  var getUserDetails = function(token, callback) {
    var options = {
      url: 'https://sandbox-api.uber.com/v1/me',
      headers:{
        'Authorization':'Bearer ' + token
      }
    }
    request.get(options, function (err, res, body) {
      if (err) {
        callback(err, body)
      }
      else {
        callback(err, body)
      }
    })
  }


  //request ride - uber go as product id

  app.post('/hueber/v1/request', function(req,res){
    console.log("Token " + req.user.token)
    placeRequest(req.user.token, function(err, response){
      updateHueLights(getState("on", 255, 98, 0));
      hueAPI.lights().then(displayResult).done();
      res.json(JSON.parse(response))
    })
  })

  var placeRequest = function(token, callback){
    var options = {
      url : 'https://sandbox-api.uber.com/v1/requests',
      method: 'POST',
      headers:{
        'Authorization':'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "product_id": "a1111c8c-c720-46c3-8534-2fcdd730040d",
        "start_latitude": 37.761492,
        "start_longitude": -122.423941,
        "end_latitude": 37.775393,
        "end_longitude": -122.417546
      })
    }
    request(options, function(err, res, body){
      callback(null, body)
    })
  }

  app.post('/hueber/v1/sendsos', function(req, res){
    console.log("sending.. SOS");
    sosState = lightState.create().on().rgb(255, 0, 0).longAlert();
    hueAPI.setLightState(2, sosState).then(displayResult).fail(displayError).done();
    res.send({status:"success", message:"SOS Sent"})
  });


  app.post('/hueber/v1/finishRide', function(req, res){
    console.log("finishig ride.. ");
    sosState = lightState.create().on().rgb(137, 0, 255);
    hueAPI.setLightState(1, sosState).then(displayResult).fail(displayError).done();
    res.send({status:"success", message:"Finished Ride"})
  });

  app.post('/hueber/v1/enRoute', function(req, res){
    console.log("finishig ride.. ");
    sosState = lightState.create().on().rgb(0, 255, 0);
    hueAPI.setLightState(1, sosState).then(displayResult).fail(displayError).done();
    res.send({status:"success", message:"En Route"})
  });


  app.post('/hueber/v1/stopLights', function(req, res){
    console.log("stop lights..");
    sosState = lightState.create().off();
    hueAPI.setLightState(1, sosState).then(displayResult).fail(displayError).done();
    hueAPI.setLightState(2, sosState).then(displayResult).fail(displayError).done();
    res.send({status:"success", message:"Stopped Lights"})
  });


  //get request by id - current request
  app.get('/hueber/v1/requests/current', function(req, res){
    getRequests(req.user.token, function(err, response){
      res.json(JSON.parse(response))
    })
  })

  var getRequests = function(token, callback){
    var options = {
      url : 'https://sandbox-api.uber.com/v1/requests/current',
      headers: {
        'Authorization':'Bearer ' + token
      }
    }
    request.get(options, function(err,res,body){
      if(err){
        callback(err,body)
      }
      else
      {
        callback(err,body)
      }
    })
  }


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}