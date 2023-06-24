const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const { hashElement } = require('folder-hash');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackNotifierPlugin = require('webpack-notifier');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const environment = require('./environment');
const proxyConfig = require('./proxy.conf');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = async (config, options, targetOptions) => {
  const languagesHash = await hashElement(path.resolve(__dirname, '../src/main/webapp/i18n'), {
    algo: 'md5',
    encoding: 'hex',
    files: { include: ['*.json'] },
  });
  // console.error(environment.FRONT_URL)
  // console.error(environment.SERVER_API_URL)

  // PLUGINS
  if (config.mode === 'development') {
    // remove 2 first minimizers, hoping they are the TerserPlugin
    config.optimization.minimizer.shift();
    config.optimization.minimizer.shift();

    config.optimization.minimizer.unshift(
      new ESBuildMinifyPlugin({
        target: 'es2015', // Syntax to compile to (see options below for possible values)
      })
    );

    config.plugins.push(
      new ESLintPlugin({
        extensions: ['js', 'ts'],
      }),
      new WebpackNotifierPlugin({
        title: 'Grade Scope Istic',
        contentImage: path.join(__dirname, 'logo-jhipster.png'),
      }),
      new webpack.DefinePlugin({
        I18N_HASH: JSON.stringify(languagesHash.hash),
        // APP_VERSION is passed as an environment variable from the Gradle / Maven build tasks.
        __VERSION__: JSON.stringify(environment.__VERSION__),
        __DEBUG_INFO_ENABLED__: environment.__DEBUG_INFO_ENABLED__ || config.mode === 'development',
        // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
        // If this URL is left empty (""), then it will be relative to the current context.
        // If you use an API server, in `prod` mode, you will need to enable CORS
        // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
        SERVER_API_URL: JSON.stringify(environment.SERVER_API_URL),
        FRONT_URL: JSON.stringify(environment.FRONT_URL),
        __CONNECTION_METHOD__: JSON.stringify(environment.__CONNECTION_METHOD__),
        __CAS_SERVER_URL__: JSON.stringify(environment.__CAS_SERVER_URL__),
        __SERVICE_URL__: JSON.stringify(environment.__SERVICE_URL__),
      })
    );
  }

  // configuring proxy for back end service
  const tls = Boolean(config.devServer && config.devServer.https);
  if (config.devServer) {
    config.devServer.proxy = proxyConfig({ tls });
  }

  if (targetOptions.target === 'serve' || config.watch) {
    // remove 2 first minimizers, hoping they are the TerserPlugin
    config.optimization.minimizer.shift();
    config.optimization.minimizer.shift();

    config.optimization.minimizer.unshift(
      new ESBuildMinifyPlugin({
        target: 'es2015', // Syntax to compile to (see options below for possible values)
      })
    );

    config.plugins.push(
      new BrowserSyncPlugin(
        {
          host: 'localhost',
          port: 9000,
          https: tls,
          proxy: {
            target: `http${tls ? 's' : ''}://localhost:${targetOptions.target === 'serve' ? '4200' : '8080'}`,
            ws: true,
            proxyOptions: {
              changeOrigin: false, //pass the Host header to the backend unchanged  https://github.com/Browsersync/browser-sync/issues/430
            },
          },
          socket: {
            clients: {
              heartbeatTimeout: 60000,
            },
          },
          /*
          ghostMode: { // uncomment this part to disable BrowserSync ghostMode; https://github.com/jhipster/generator-jhipster/issues/11116
            clicks: false,
            location: false,
            forms: false,
            scroll: false,
          },
          */
        },
        {
          reload: targetOptions.target === 'build', // enabled for build --watch
        }
      )
    );
  }

  if (config.mode === 'production') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        // Webpack statistics in target folder
        reportFilename: '../stats.html',
      }),
      new webpack.DefinePlugin({
        I18N_HASH: JSON.stringify(languagesHash.hash),
        // APP_VERSION is passed as an environment variable from the Gradle / Maven build tasks.
        __VERSION__: JSON.stringify(environment.__VERSION__),
        __DEBUG_INFO_ENABLED__: environment.__DEBUG_INFO_ENABLED__ || config.mode === 'development',
        // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
        // If this URL is left empty (""), then it will be relative to the current context.
        // If you use an API server, in `prod` mode, you will need to enable CORS
        // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
        SERVER_API_URL: JSON.stringify(environment.SERVER_API_URL),
        FRONT_URL: JSON.stringify(environment.FRONT_URL),
        __CONNECTION_METHOD__: JSON.stringify(environment.__CONNECTION_METHOD__),
        __CAS_SERVER_URL__: JSON.stringify(environment.__CAS_SERVER_URL__),
        __SERVICE_URL__: JSON.stringify(environment.__SERVICE_URL__),
      })
    );
  }

  const patterns = [
    // jhipster-needle-add-assets-to-webpack - JHipster will add/remove third-party resources in this array
  ];

  if (patterns.length > 0) {
    config.plugins.push(new CopyWebpackPlugin({ patterns }));
  }

  config.plugins.push(
    /*new webpack.DefinePlugin({
      I18N_HASH: JSON.stringify(languagesHash.hash),
      // APP_VERSION is passed as an environment variable from the Gradle / Maven build tasks.
      __VERSION__: JSON.stringify(environment.__VERSION__),
      __DEBUG_INFO_ENABLED__: environment.__DEBUG_INFO_ENABLED__ || config.mode === 'development',
      // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
      // If this URL is left empty (""), then it will be relative to the current context.
      // If you use an API server, in `prod` mode, you will need to enable CORS
      // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
      SERVER_API_URL: JSON.stringify(environment.SERVER_API_URL),
    }),*/
    new MergeJsonWebpackPlugin({
      output: {
        groupBy: [
          { pattern: './src/main/webapp/i18n/fr/*.json', fileName: './i18n/fr.json' },
          { pattern: './src/main/webapp/i18n/en/*.json', fileName: './i18n/en.json' },
          // jhipster-needle-i18n-language-webpack - JHipster will add/remove languages in this array
        ],
      },
    })
  );

  config = merge(
    config
    // jhipster-needle-add-webpack-config - JHipster will add custom config
  );

  //  config.plugins.push(new NodePolyfillPlugin());

  return config;
};
