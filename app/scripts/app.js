'use strict';
var pfeApp = angular.module('pfeApp', ['ngRoute', 'ui.router', 'flow', 'services.config']);
pfeApp.config(
  function($routeProvider, $stateProvider) {
    $stateProvider
      .state('index', {
        url: '',
        views: {
          'bodyContentView': {
            templateUrl: 'views/loginSign/loginSign.html',
            controller: 'LoginSignCtrl'
          },
          'footerContentView': {
            templateUrl: 'views/footer/footer.html',
          }
        }
      }).state('home', {
        url: '/home',
        views: {
          'bodyContentView': {
            templateUrl: 'views/home/home.html',
            controller: 'HomeCtrl'
          },
          'footerContentView': {
            templateUrl: 'views/footer/footer.html',
          },
          'sideContentView': {
            templateUrl: 'views/sideBar/sideBar.html',
            controller: 'SideBarCtrl'
          },
          'headerContentView': {
            templateUrl: 'views/header/header.html',
            controller: 'HeaderCtrl'
          }
        }
      }).state('produit', {
        url: '/produit',
        views: {
          'bodyContentView': {
            templateUrl: 'views/produit/produit.html',
            controller: 'ProduitCtrl'
          },
          'footerContentView': {
            templateUrl: 'views/footer/footer.html',
          },
          'sideContentView': {
            templateUrl: 'views/sideBar/sideBar.html',
            controller: 'SideBarCtrl'
          },
          'headerContentView': {
            templateUrl: 'views/header/header.html',
            controller: 'HeaderCtrl'
          }
        }
      })
  })

//     when('/', {
//       views: {
//         "bodyContentView": {
//         template: "index.viewA"
//         }
//       }
//     }).when('/produit', {
//       templateUrl: 'views/produit/produit.html',
//       controller: 'ProduitCtrl'
//     }).otherwise({
//       redirectTo: '/'
//     });
//   }
// ]).run(function($rootScope, $location) {
//   $rootScope.socket = io.connect('http://localhost:3000');
//   $rootScope.$on('$routeChangeStart', function() {
//     console.log($location.path());
//   });
// });