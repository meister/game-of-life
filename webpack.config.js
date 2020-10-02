const path = require('path');

module.exports = {
	entry: {
		app: ['webpack/hot/dev-server', './app/main.js']
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js'
	},
	devServer: {
		contentBase: path.join(__dirname, 'build'),
		compress: true,
		port: 9000
	}
};