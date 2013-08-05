'use strict';

angular.module('RaspberryHome', ['btford.socket-io'])
  .config(function ($routeProvider) {
    $routeProvider.
      when('/view1', {
        templateUrl: 'partials/partial1.html',
        controller: 'MyCtrl1'
      }).
      otherwise({
        redirectTo: '/view1'
      });
  });

angular.module('RaspberryHome').
  controller('AppCtrl', function () { }).
  controller('MyCtrl1', function ($scope, socket) {
    socket.on('rpi_data', function (data) {
      console.log("got data", data);
      $scope.data = data;
    });
  });