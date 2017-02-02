var path = require('path');

function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(chain) {
  var middleware = compose(...chain);
  return (paths, config) => middleware(paths, config);
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
  initConfig: initConfig,
};