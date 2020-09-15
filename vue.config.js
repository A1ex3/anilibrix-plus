// Import custom configs
const pwaConfig = require('./pwa.config');
const webpackConfig = require('./webpack.config');
const desktopConfig = require('./desktop.config');

module.exports = {
  pwa: pwaConfig,
  lintOnSave: false,
  configureWebpack: {
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins,
  },
  pluginOptions: {
    ...desktopConfig,
  }
};