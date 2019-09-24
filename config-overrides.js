/* config-overrides.js */
var PrettierPlugin = require("prettier-webpack-plugin");


module.exports = function override(config, env) {
  //do stuff with the webpack config...
  return {
    ...config,
    plugins: [
      ...config.plugins,
    ]
  };
}
