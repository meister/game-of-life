module.exports = {
	entry: {
		app: ['webpack/hot/dev-server', './app/main.js']
	},
	output: {
		path: './build',
		filename: 'bundle.js'
	}
};