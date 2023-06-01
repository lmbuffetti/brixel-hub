process.env.NODE_ENV = process.argv[process.argv.length - 1];
process.env.BABEL_ENV = process.argv[process.argv.length - 1];
const path = require('path');
const webpack = require('webpack');
const glob = require('glob-all');
const {default: baseByData} = require('@brixel/brixel-components/dist/configuration/SettingsWebpack.js');
const {default: companyData} = require('@brixel/brixel-components/dist/configuration/CompanyInfo.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const safelistClass = require('./webapckSafelistClass');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { GenerateSW } = require('workbox-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const ROOT_DIR = path.resolve(__dirname, './');
const BUILD_DIR = path.join(ROOT_DIR, './dist');
const devMode = process.argv[process.argv.length - 1] === 'development';
const getEnvBuild = process.argv[process.argv.length - 3];
const mode = devMode ?  'development' : 'production';

const PATHS = {
  src: path.join(__dirname, 'src'),
  modules: path.join(__dirname, 'node_modules/@brixel/brixel-components/dist'),
  dist: path.join(__dirname, 'dist'),
};

const sourceMap = (testMode) => (testMode || devMode) ? 'hidden-source-map' : 'source-map';

const ModeType = (testMode) => {
  if (testMode && devMode) return 'full';
  if (testMode && !devMode) return 'test';
  if (!testMode && devMode) return 'dev';
  return 'prod'
}

const clientConfig = (env) => {
  const testMode = env.TEST;
  const config = ({
    mode: mode,
    devtool: sourceMap(testMode),
    entry: {
      polyfill: '@babel/polyfill',
      main: [
        './src/index.tsx',
        './service-worker-brixel.js',
        './src/styles/SCSS/general/main.scss',
      ],
      secondary: [
        './src/styles/SCSS/styleguide/grid.scss',
      ],
      styleguide: [
        './src/styles/SCSS/styleguide/mainStyleguide.scss',
        './src/styles/SCSS/styleguide/container.scss',
        './src/styles/SCSS/styleguide/fontStyle.scss',
        './src/styles/SCSS/styleguide/spacing.scss',
        './src/styles/SCSS/styleguide/boxModel.scss',
      ],
      primary: [
        './src/styles/SCSS/general/componentsLoad.scss',
        './src/styles/SCSS/styleguide/helpers.scss',
      ],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'src'),
      },
      liveReload: true,
      compress: ModeType(testMode) === 'full',
      port: 5000,
      historyApiFallback: true,
      open: ModeType(testMode) === 'dev',
    },
    output: {
      publicPath: '/',
      path: BUILD_DIR,
      filename: 'js/[name].bundle.js',
      chunkFilename: ModeType(testMode) === 'full' ? 'js/[name].js' : 'js/[name].[fullhash].js',
      globalObject: 'this',
    },
    stats: {
      assets: false,
      chunks: false,
      modules: false,
      outputPath: false,
      publicPath: false,
      errors: true,
      warnings: true,
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: devMode && !testMode,
                importLoaders: 1,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: 'compressed',
                },
                sourceMap: devMode && !testMode,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        },
        {
          test: /\.(ts|js)x$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  '@babel/plugin-syntax-dynamic-import',
                ],
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: 'ts-loader',
        },
        // Svg loader
        {
          test: /\.svg$/,
          resourceQuery: { not: [/url/] },
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                svgoConfig: {
                  plugins: [{
                    name: 'removeViewBox',
                    active: false,
                  }],
                },
              },
            },
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images/',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          resourceQuery: /url/, // *.svg?url
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext][query]',
          },
        },
        // Fonts loader
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext][query]',
          },
        },
        // Images loader
        {
          test: /\.(jpeg|png|gif|jpg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext][query]',
          },
        },
        {
          type: 'javascript/auto',
          exclude: /(node_modules|bower_components|public)/,
          test: /\.json$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'json/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin({
        dry: true,
        verbose: true,
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode || testMode ? 'css/[name].css' : 'css/[name].[fullhash].css',
        chunkFilename: devMode || testMode ? 'css/[name]_[id].css' : 'css/[name]_[id].[chunkhash].css',
      }),
      new WebpackPwaManifest({
        name: 'Brixel Hub',
        short_name: 'Hub',
        description: 'Brixel Hub',
        background_color: '#ffffff',
        start_url: '/',
        filename: "manifest_config.json",
      }),
      new WebpackManifestPlugin({
        writeToFileEmit: true,
        start_url: '/'
      }),
      // new BundleAnalyzerPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    performance: {
      hints: false
    },
  });
  if (testMode) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: './index.html',
        template: './index.html',
      }),
    )
  }
  if (!testMode) {
    config.plugins.push(
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'],
        failOnError: !devMode,
        failOnWarning: !devMode,
        emitWarning: true,
        emitError: true,
        fix: true,
      }),
      new CopyPlugin({
        patterns: [
          { from: './public/favicon.png', to: './' },
          { from: './server.js', to: './' },
        ],
      }),
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(devMode ? 'development' : 'production'),
        'process.env': {
          NODE_ENV: JSON.stringify(devMode ? 'development' : 'production'),
        },
      }),
      new HtmlWebpackPlugin({
        chunksSortMode: 'none',
        hash: true,
        inject: true,
        filename: './index.html',
        template: './index.html',
        title: companyData?.hub?.title,
        cache: true,
        meta: {
          keywords: companyData?.hub?.keywords,
        },
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        transifexKey: baseByData(getEnvBuild)?.transifexIdHub,
        googleAnalyticsId: baseByData(getEnvBuild)?.googleAnalyticsIdHub,
      }),
    )
  }
  if (ModeType(testMode) === 'prod') {
    config.plugins.push(
      new PurgeCSSPlugin({
        paths: glob.sync([
          `${PATHS.src}/**/*`,
          `${PATHS.modules}/**/*`,
          `${PATHS.dist}/**/*`,
        ], { nodir: true }),
        safelist: safelistClass,
      }),
      new GenerateSW({
        swDest: 'service-worker-brixel.js',
        cacheId: 'service-worker-brixel',
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/static/, /^\/dist/, /^\/public/],
        maximumFileSizeToCacheInBytes: 500000000,
      })
    )
    config.optimization = {
      splitChunks: {
        chunks: 'async',
        minSize: 2000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 5000,
      },
      emitOnErrors: true,
      concatenateModules: true,
      removeAvailableModules: true,
      mergeDuplicateChunks: true,
      portableRecords: true,
      removeEmptyChunks: true,
      nodeEnv: 'production',
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
      ],
    };
  }
  return config;
};

module.exports = [clientConfig];
