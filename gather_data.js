'use strict';

var exec = require('child_process').exec,
    Q = require('q');

var scripts = {
  temperature: "./rpi_scripts/temp",
  filesystem: {
    used:  "./rpi_scripts/filesystem_size 3",
    total: "./rpi_scripts/filesystem_size 2",
  }
};



var callScript = exports.callScript = function(script, extraArgs) {
  extraArgs = extraArgs || [];
  script = script + " " + extraArgs.join(" ");

  var deferred = Q.defer();
  exec(script, function(err, stdout, stderr) {
    
    if (err) {
      deferred.reject(stderr);
      //console.log("error", arguments);
    }
    else {
      // trim whitespace out of result
      deferred.resolve(stdout.replace(/(^[\s]+|[\s]+$)/g, ''));
      //console.log("resolved",script,"to",[stdout]);
    }
  });
  return deferred.promise;
};

exports.gatherData = function(filesystems) {
  var deferred = Q.defer(),
      data     = { filesystem: {} },
      promises = [];

  promises.push(
    callScript(scripts.temperature).then(function(result) {
      data.temperature = result;
    }));

  var addResult = function(fs, type) {
    return function(result) {
      data.filesystem[fs][type] = result;
    };
  };

  for (var i in filesystems) {
    var fs = filesystems[i];
    data.filesystem[fs] = {};

    for (var type in scripts.filesystem) {
      var call_promise = callScript(scripts.filesystem[type], [fs]);
      promises.push(call_promise.then(addResult(fs, type)));
    }
  }
  console.log(promises);
  Q.all(promises)
    .then(function() {
      console.log("resolve", promises,  data);
      deferred.resolve(data);
    });
  return deferred.promise;
};