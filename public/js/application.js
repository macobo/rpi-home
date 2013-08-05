'use strict';

angular.module('RaspberryHome', ['btford.socket-io'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/view1', {
        templateUrl: 'partials/partial1.html',
        controller: 'MyCtrl1'
      }).
      when('/view2', {
        templateUrl: 'partials/partial2.html',
        controller: 'MyCtrl2'
      }).
      otherwise({
        redirectTo: '/view1'
      });
  });

angular.module('RaspberryHome').
  controller('AppCtrl', function ($scope, socket) {
    socket.on('send:name', function (data) {
      $scope.name = data.name;
    });
  }).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('send:time', function (data) {
      console.log("got time", data);
      $scope.time = data.time;
    });
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });