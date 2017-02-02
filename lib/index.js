'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var path = require('path');

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

function applyMiddleware(chain) {
  var middleware = compose.apply(undefined, _toConsumableArray(chain));
  return function (paths, config) {
    return middleware(paths, config);
  };
}

function initConfig(env) {
  var state = {};
  state.paths = require('react-scripts/config/paths');

  switch (env.toLowerCase()) {
    case 'dev':
      process.env.NODE_ENV = 'development';
      state.config = require('react-scripts/config/webpack.config.dev');
      break;
    case 'production':
      process.env.NODE_ENV = 'production';
      state.config = require('react-scripts/config/webpack.config.prod');
      break;
  }
  var packageJson = require(state.paths.appPackageJson);
  if (packageJson['react-scripts-config'] && packageJson['react-scripts-config']['middlewares']) {
    var middlewares = require(path.resolve(process.cwd(), packageJson['react-scripts-config']['middlewares']));
    if (middlewares && middlewares.length) {
      state = applyMiddleware(middlewares)(state.paths, state.config);
    }
  }
  return state;
}

module.exports = {
  initConfig: initConfig
};