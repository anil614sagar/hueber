var hueberApp = angular.module('hueberApp', ['ui.router'])

hueberApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    // route to show our basic form (/form)
    .state('hueber', {
      url: '/profile',
      templateUrl: '/views/form.html',
      controller: 'formController'
    });


  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
})

