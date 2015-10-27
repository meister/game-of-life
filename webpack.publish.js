var webpack = require('webpack');

module.exports = {
	entry: {
		app: ['./app/main.js']
	},
	output: {
		path: './build',
		filename: 'bundle.min.js'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false,
				screw_ie8: true
			}
		})
	]
};