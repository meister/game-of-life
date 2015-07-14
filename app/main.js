var Board = require('./board-canvas'),
	CycleController = require('./cycle-controller'),
	Universe = require('./universe'),

universe = new Universe({
	seed: {
		type: 'random',
		pattern: 'random'
	}
}),

board = new Board({
	container: '#board',
	universe: universe,
	cellSize: 4
});

new CycleController({
	// board view
	board: board,
	// in milliseconds
	cycle: 60,
	// handle seed change
	onChangeSeed: function(pattern) {
		board.setUniverse(new Universe({
			seed: {
				type: pattern === 'random' ? 'random' : 'pattern',
				pattern: pattern
			},
			width: universe.width,
			height: universe.height
		}));
	}
});