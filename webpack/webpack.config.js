const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  plugins: [], //[new NodePolyfillPlugin()],
  ignoreWarnings: [
    {
      module: /onnxruntime-web/,
      message: /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
    },
  ],
};
