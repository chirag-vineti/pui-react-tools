'use strict';

var gulp = require('gulp');
var npm = require('npm');
var path = require('path');

var _require = require('child_process'),
    spawn = _require.spawn;

function crossPlatformSpawn(cmd, args, options) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/c', cmd].concat(args), options);
  }
  return spawn(cmd, args, options);
}

var Foreman = {
  install: function install() {
    gulp.task('foreman', Foreman.tasks.foreman);
  },


  tasks: {
    foreman: function foreman(callback) {
      npm.load(function (err) {
        if (err) {
          callback(err);
          return;
        }
        var child = crossPlatformSpawn(path.join(npm.bin, 'nf'), ['start', '-j', 'Procfile.dev'], { stdio: 'inherit', env: process.env }).once('close', callback);
        ['SIGINT', 'SIGTERM'].forEach(function (e) {
          return process.once(e, function () {
            return child && child.kill();
          });
        });
      });
    }
  }
};

module.exports = Foreman;