process.env.NODE_ENV = process.argv[process.argv.length - 1];
process.env.BABEL_ENV = process.argv[process.argv.length - 1];
const path = require('path');
const webpack = require('webpack');
const baseByData = require('@brixel/brixel-configuration-partner/src/SettingsWebpack');
const companyData = require('@brixel/brixel-configuration-partner/src/CompanyInfo');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const CSSNano = require('cssnano');

// const devMode = false;
const ROOT_DIR = path.resolve(__dirname, './');
const BUILD_DIR = path.join(ROOT_DIR, './dist');
const devMode = process.argv[process.argv.length - 1] === 'development';
const getEnvBuild = process.argv[process.argv.length - 3];

const clientConfig = {
  mode: 'development',
  devtool: devMode ? 'inline-source-map' : 'cheap-source-map',
  entry: {
    polyfill: '@babel/polyfill',
    main: [
      './src/index.jsx',
      './src/styles/SCSS/general/main.scss',
    ],
    secondary: [
      './src/styles/SCSS/styleguide/helpers.scss',
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
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: devMode,
    port: 5000,
    historyApiFallback: true,
    open: true,
  },
  output: {
    publicPath: '/',
    path: BUILD_DIR,
    filename: 'js/[name].bundle.js',
    chunkFilename: devMode ? 'js/[name].js' : 'js/[name].[hash].js',
    hotUpdateChunkFilename: devMode ? 'hot/hot-update.js' : 'hot/hot-update.[hash].js',
    hotUpdateMainFilename: devMode ? 'hot/hot-update.json' : 'hot/hot-update.[hash].js',
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
              sourceMap: devMode,
              importLoaders: 1
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "autoprefixer",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed',
              },
              sourceMap: devMode,
            },
          },
        ],
      },
      {
        test: /\.jsx?/,
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
          {
            loader: 'eslint-loader',
            options: {
              failOnError: !devMode,
              failOnWarning: !devMode,
              emitWarning: true,
              fix: true,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
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
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'fonts/',

          },
        }],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{
          loader: 'file-loader?name=images/[name].[ext]',
          options: {
            esModule: false,
          },
        }],
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: devMode ? 'css/[name]_[id].css' : 'css/[name]_[id].[hash].css',
    }),
    new CleanWebpackPlugin({
      dry: false,
      verbose: false,
      cleanOnceBeforeBuildPatterns: ['*', '!manifest.json'],
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: './public/favicon.png', to: './' },
        { from: './src/images/location/icon_location.png', to: './images' },
      ],
    }),
    // new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      hash: true,
      inject: true,
      filename: './index.html',
      template: './public/index.html',
      title: companyData.hub.title,
      meta: {
        keywords: companyData.hub.keywords,
      },
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
      transifexKey: baseByData(getEnvBuild).transifexIdHub,
      googleAnalyticsId: baseByData(getEnvBuild).googleAnalyticsIdHub,
      facebookPixelId: baseByData(getEnvBuild).facebookPixel,
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(devMode ? 'development' : 'production'),
      'process.env': {
        NODE_ENV: JSON.stringify(devMode ? 'development' : 'production'),
      },
      'process.env.client': true,
      'process.env.BROWSER': JSON.stringify(true),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    nodeEnv: devMode ? 'development' : 'production',
    minimize: !devMode,
    splitChunks: {
      chunks: 'all',
      maxSize: 200000,
      cacheGroups: {
        default: false, // disable the built-in groups, default & vendors (vendors is overwritten below)
        reactDom: {
          test: /[\\/]node_modules[\\/]react-dom[\\/]/,
          name: 'vendor.react-dom',
          enforce: !devMode,
          maxSize: 200000,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: !devMode, // create chunk regardless of the size of the chunk
          maxSize: 200000,
        },
      },
    },
  },
};

module.exports = [clientConfig];
