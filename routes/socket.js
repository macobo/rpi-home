'use strict';
/*
 * Serve content over a socket
 */

module.exports = function (socket) {
  var rpi = require('../gather_data.js');

  var emit = function(name) {
    return function(data) {
      socket.emit(name, data);
    };
  };

  var busyloop = function() {
    rpi.gatherData(['/']).then(emit('rpi_data'));
  };

  setInterval(busyloop, 1000);
};