'use strict';

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

var typescriptPlugin = function typescriptPlugin(paths, config) {
  // Change entry
  config.entry.pop();
  config.entry.push(paths.appIndexJs);
  // Add support typescript file extensions
  config.resolve.extensions = config.resolve.extensions.concat(['.ts', '.tsx']);
  // exclude typescript extensions out of url-loader
  var loaderUrlIndex = config.module.loaders.findIndex(function (loader) {
    return loader.loader === "url";
  });
  if (loaderUrlIndex >= 0) {
    config.module.loaders[loaderUrlIndex].exclude = config.module.loaders[loaderUrlIndex].exclude.concat([/\.(ts|tsx)$/]);
  }
  // Add typescript loader
  config.module.loaders = config.module.loaders.concat([{
    test: /\.(ts|tsx)$/,
    include: paths.appSrc,
    loader: 'ts'
  }]);
  return config;
};

module.exports = function (paths, config) {
  var middleware = compose(typescriptPlugin);
  return middleware(paths, config);
};