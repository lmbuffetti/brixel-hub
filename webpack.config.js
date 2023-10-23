process.env.NODE_ENV = process.argv[process.argv.length - 1];
process.env.BABEL_ENV = process.argv[process.argv.length - 1];
const path = require('path');
const webpack = require('webpack');
const glob = require('glob-all');
const {default: baseByData} = require('@brixel-io/brixel-components/dist/configuration/SettingsWebpack.js');
const {default: companyData} = require('@brixel-io/brixel-components/dist/configuration/CompanyInfo.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const safelistClass = require('./webapckSafelistClass');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const ROOT_DIR = path.resolve(__dirname, './');
const BUILD_DIR = path.join(ROOT_DIR, './dist');
const devMode = process.argv[process.argv.length - 1] === 'development';
const getEnvBuild = process.argv[process.argv.length - 3];
const mode = devMode ?  'development' : 'production';
const prefix = 'hub';

const PATHS = {
  src: path.join(__dirname, 'src'),
  modules: path.join(__dirname, 'node_modules/@brixel-io/brixel-components/dist'),
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
      filename: `js/${prefix}-[name].bundle.js`,
      chunkFilename: ModeType(testMode) === 'full' ? `js/${prefix}-[name].js` : `js/${prefix}-[name].js?[fullhash]`,
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
        filename: devMode || testMode ? `css/${prefix}-[name].css` : `css/${prefix}-[name].css?[fullhash]`,
        chunkFilename: devMode || testMode ? `css/${prefix}-[name]_[id].css` : `css/${prefix}-[name]_[id].css?[chunkhash]`,
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
        template: './public/index.html',
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
        template: './public/index.html',
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
        transifexKey: baseByData(getEnvBuild)?.transifexIdAdmin,
        googleId: baseByData(getEnvBuild)?.googleID,
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
