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
		filename: 'bundle.js',
		publicPath: '/built/',
	},

	devServer: {
		inline: true,
		port: 3333,

		proxy: {
			//Call to backend
			'/api/**': {
				target: 'http://localhost:8090',
				// changeOrigin: true,
				logLevel: 'debug',
			},
			// as spring-boot is serving assets (located in webjar), we must add proxy
			// Not used In development mode, we set the local path to not have to build the webjar
			'/webjars/**': {
				target: 'http://localhost:8090',
				// changeOrigin: true,
				logLevel: 'debug',
			}
		}

	},

	devtool: 'source-map',

	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react']
				}
			},
			/*
			 {
			 test: /\.scss$/,
			 loaders: ["style-loader", "css-loader", "sass-loader"]
			 },
			 {
			 test: /\.css$/,
			 use: ['style-loader', 'css-loader']
			 }
			 */
		]
	},
	/*
	 sassLoader: {
	 includePaths: [path.resolve(__dirname, "./assets/css/")]
	 }
	 */
	//plugins: [HTMLWebpackPluginConfig]
}
