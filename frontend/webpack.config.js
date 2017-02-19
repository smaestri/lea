/*
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/main/webapp/thymeleaf/index.html',
  filename: 'index.html',
  inject: 'body'
});
*/
var packageJSON = require('./package.json');
var path = require('path');

const PATHS = {
  build: path.join(__dirname, 'target', 'classes', 'META-INF', 'resources', 'webjars', packageJSON.name, packageJSON.version)
};


module.exports = {

  entry: './app/app.js',
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
      },
       {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./assets/css/")]
  }
  //plugins: [HTMLWebpackPluginConfig]
}
