'use strict';
var pfeApp = angular.module('pfeApp', ['ngRoute', 'flow', 'services.config']);
pfeApp.config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home/home.html',
      controller: 'HomeCtrl'
    }).when('/produit', {
      templateUrl: 'views/produit/produit.html',
      controller: 'ProduitCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  }
]).run(function($rootScope, $location) {
  $rootScope.socket = io.connect('http://localhost:3000');
  $rootScope.$on('$routeChangeStart', function() {
    console.log($location.path());
  });
});