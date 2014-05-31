'use strict';
angular.module('pfeApp').controller('LoginSignCtrl',
	function($scope, $http, $location, serviceGeneral, configuration) {
		$scope.state = false;
		$scope.init = function() {
			console.log('init du login Sign');
			$scope.loginForm = true;
			$scope.recoverPasswordForm = false;
			$scope.createAccountForm = false;
			$scope.switchErrOff();
			// var socket = io.connect('http://localhost:3000');
			// socket.on('news', function (data) {
			//   if (data.onlineState) {
			//     $scope.state = data.onlineState;
			//   } else {
			//     $scope.state = data.onlineState;
			//   }
			//   $scope.$digest();
			//   socket.emit('my other event', { my: 'data' });
			// });
		};

		$scope.creatAccount = function() {
			console.log(serviceGeneral.verifEmail($scope.signEmail));
			if (serviceGeneral.verifEmail($scope.signEmail) && serviceGeneral.verifPassword($scope.signPassword) && serviceGeneral.verifName($scope.signName) && serviceGeneral.verifLogin($scope.signLogin) && $scope.signPassword === $scope.signRPassword) {
				console.log('tout va biennn');
				$scope.switchErrOff();
				var data = {
					login: $scope.signLogin,
					password: $scope.signPassword,
					fullName: $scope.signName,
					email: $scope.signEmail
				};
				console.log(data);
				$http.post(configuration.URL_REQUEST + '/signup', data)
					.success(function(data) {
						console.log('success sign in up');
						console.log(data);
						$location.path('/home');
					})
					.error(function(data) {
						console.log('erreur interne');
						console.log(data);
					});
			} else {
				$scope.checkSignFields();
			}
		};

		$scope.authenticate = function() {
			if (serviceGeneral.verifLogin($scope.loginLogin) && serviceGeneral.verifPassword($scope.passwordLogin)) {
				$scope.switchErrOff();
				var data = {
					login: $scope.loginLogin,
					password: $scope.passwordLogin
				}
				$http.post(configuration.URL_REQUEST + '/login', data)
					.success(function(data) {
						console.log(data);
						$location.path('/home')
					})
					.error(function(data) {
						console.log(data);
					});
			} else {
				$scope.errloginAction = true;
			}
		};

		$scope.switch = function() {
			$scope.loginForm = !$scope.loginForm;
			$scope.recoverPasswordForm = !$scope.recoverPasswordForm;
			$scope.createAccountForm = false;
		};
		$scope.createAccount = function() {
			$scope.loginForm = false;
			$scope.recoverPasswordForm = false;
			$scope.createAccountForm = true;
		};
		$scope.switchAuth = function() {
			$scope.loginForm = true;
			$scope.recoverPasswordForm = false;
			$scope.createAccountForm = false;
		};
		$scope.checkSignFields = function() {
			if (!serviceGeneral.verifEmail($scope.signEmail)) {
				$scope.errEmail = true;
			} else {
				$scope.errEmail = false;
			}
			if (!serviceGeneral.verifLogin($scope.signLogin)) {
				$scope.errLogin = true;
			} else {
				$scope.errLogin = false;
			}
			if (!serviceGeneral.verifName($scope.signName)) {
				$scope.errName = true;
			} else {
				$scope.errName = false;
			}
			if (!serviceGeneral.verifPassword($scope.signPassword) || $scope.signPassword !== $scope.signRPassword) {
				$scope.errPassword = true;
			} else {
				$scope.errPassword = false;
			}
		};
		$scope.switchErrOff = function() {
			$scope.errConfirmation = false;
			$scope.errEmail = false;
			$scope.errPassword = false;
			$scope.errName = false;
			$scope.errLogin = false;
			$scope.errloginAction = false;
		};
	}
);