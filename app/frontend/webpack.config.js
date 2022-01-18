const path = require("path");
// const webpack = require("webpack");

module.exports = {
  entry: "./src/sentinels.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "./bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$|jsx/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/env', '@babel/react']
          }
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '*']
  }
};