const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    polyfill: '@babel/polyfill',
    main: [
      '../../src/styles/SCSS/general/main.scss',
    ],
    secondary: [
      '../../src/styles/SCSS/styleguide/grid.scss',
    ],
    styleguide: [
      '../../src/styles/SCSS/styleguide/mainStyleguide.scss',
      '../../src/styles/SCSS/styleguide/container.scss',
      '../../src/styles/SCSS/styleguide/fontStyle.scss',
      '../../src/styles/SCSS/styleguide/spacing.scss',
      '../../src/styles/SCSS/styleguide/boxModel.scss',
    ],
    primary: [
      '../../src/styles/SCSS/general/componentsLoad.scss',
      '../../src/styles/SCSS/styleguide/helpers.scss',
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'),
    },
    liveReload: true,
    compress: false,
    port: 5000,
    historyApiFallback: true,
    open: false,
  },
  mode: 'development',
  devtool: false,
  resolve: {
    alias: {
      '@': path.resolve('resources/js'),
    },
    modules: [path.join(__dirname, 'modules'), 'node_modules'],
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].css',
      chunkFilename: 'css/[name]_[id].css',
    }),
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              [
                '@babel/plugin-transform-modules-commonjs',
                {
                  loose: true,
                },
              ],
            ],
          },
        },
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
        ],
      },
      // For compiling sass
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed',
              },
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset',
      },
      // Images loader
      {
        test: /\.(jpeg|png|gif|jpg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]',
        },
      },
    ],
  },
};
