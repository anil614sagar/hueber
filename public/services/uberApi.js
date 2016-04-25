hueberApp.factory('uberApi', ['$http', function($http) {
  var runApi = {};
  var urlBase = 'hueber/v1';
  runApi.getUserDetails = function() {
    return $http.get(urlBase + '/user/me');
  }

  runApi.bookRide = function(username, ipAddress) {
    return $http.post(urlBase + '/request', {username: username, ipAddress: ipAddress});
  }

  runApi.sendSos = function(username, ipAddress) {
    return $http.post(urlBase + '/sendsos', {username: username, ipAddress: ipAddress});
  }

  runApi.finishRide = function(username, ipAddress) {
    return $http.post(urlBase + '/finishRide', {username: username, ipAddress: ipAddress});
  }

  runApi.stopLights = function(username, ipAddress) {
    return $http.post(urlBase + '/stopLights', {username: username, ipAddress: ipAddress});
  }

  runApi.enRoute = function(username, ipAddress) {
    return $http.post(urlBase + '/enRoute', {username: username, ipAddress: ipAddress});
  }


  return runApi;
}]);