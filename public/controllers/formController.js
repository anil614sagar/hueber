/**
 * Created by Anil on 15/03/16.
 */
hueberApp.controller('formController', ['$scope', '$timeout', '$stateParams', 'uberApi', function($scope, $timeout, $stateParams, uberApi) {
  $scope.username = ''
  $scope.philipsIpAddress = '192.168.1.131'
  $scope.philipsUserName = 'e6bb9744b3c8af6d0479c212e4e17'
  uberApi.getUserDetails()
    .then(function (response) {
      $scope.username = response.data.first_name + ' ' + response.data.last_name;
      $scope.userphoto = response.data.picture
      console.log(response)
    }, function (error) {
      console.log(error)
    })

  $scope.bookRide = function() {
    uberApi.bookRide($scope.philipsUserName, $scope.philipsIpAddress)
      .then(function (response) {
        alert('Your ride is on your way..')
        console.log(response)
      }, function (error) {
        console.log(error)
      })
  }

  $scope.sendSos = function() {
    uberApi.sendSos($scope.philipsUserName, $scope.philipsIpAddress)
      .then(function (response) {
        alert('Your Family Alerted....')
        console.log(response)
      }, function (error) {
        console.log(error)
      })
  }

  $scope.finishRide = function() {
    uberApi.finishRide($scope.philipsUserName, $scope.philipsIpAddress)
      .then(function (response) {
        alert('Thank you for choosing Hueber....')
        console.log(response)
      }, function (error) {
        console.log(error)
      })
  }

  $scope.stopLights = function() {
    uberApi.stopLights($scope.philipsUserName, $scope.philipsIpAddress)
      .then(function (response) {
        alert('Your Family has been updated....')
        console.log(response)
      }, function (error) {
        console.log(error)
      })
  }

  $scope.enRoute = function() {
    uberApi.enRoute($scope.philipsUserName, $scope.philipsIpAddress)
      .then(function (response) {
        alert('Your Family has been updated....')
        console.log(response)
      }, function (error) {
        console.log(error)
      })
  }


}])