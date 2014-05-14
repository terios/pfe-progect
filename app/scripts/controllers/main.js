'use strict';

angular.module('pfeApp')
    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.state=false;
        $scope.init = function () {
            var socket = io.connect('http://localhost:3000');
            socket.on('news', function (data) {
                if (data.onlineState) {
                    $scope.state = data.onlineState;
                } else {
                    $scope.state = data.onlineState;
                }
                $scope.$digest();
                socket.emit('my other event', { my: 'data' });
            });
        };
    });
