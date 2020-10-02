const path = require('path');

module.exports = {
	entry: {
		app: ['./app/main.js']
	},
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.min.js'
	},
	optimization: {
		minimize: true
	}
};