'use strict';
var pfeApp = angular.module('pfeApp', ['ngRoute']);
pfeApp.config([
  '$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/home/home.html',
      controller: 'HeaderCtrl'
    }).otherwise({ redirectTo: '/' });
  }
]);