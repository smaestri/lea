/*
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/main/webapp/thymeleaf/index.html',
  filename: 'index.html',
  inject: 'body'
});
*/
var path = require('path');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, './src/main/webapp/built/')
};

module.exports = {

  entry: './src/main/js/app.js',
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

  // Some probleme with webpack-dev-server.


  /*
  devServer: {
    inline: true,
    port: 3333
  },
  */

  devtool: 'source-map',

  module: {
    loaders:[
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }
    ]

  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./src/main/webapp/assets/css/")]
  }
  //plugins: [HTMLWebpackPluginConfig]
}
