'use strict';

var ReactStylePlugin = require('react-style-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpackConfig = {
  devtool: 'sourcemap',
  entry: './Components/NewsList.js',

  output: {
    filename: "bundle.js",
    path: __dirname + "/build",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          ReactStylePlugin.loader(),
          'jsx-loader?harmony&sourceMap'
        ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader?sourceMap')
      }
    ]
  },
  plugins: [
//    new webpack.DefinePlugin({
//      "process.env": {
//        // This has effect on the react lib size
//        "NODE_ENV": JSON.stringify("production")
//      }
//    }),
    new ReactStylePlugin('bundle.css', {allChunks: true})
  ]
};



module.exports = webpackConfig;
