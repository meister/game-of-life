const Board = require('./board-canvas');

const CycleController = require('./cycle-controller');
const Universe = require('./universe');

const universe = new Universe({
	seed: {
		type: 'random',
		pattern: 'random'
	}
});

const board = new Board({
	container: '#board',
	universe,
	cellSize: 3
});

new CycleController({
	// board view
	board,
	// in milliseconds
	cycle: 60,
	// handle seed change
	onChangeSeed: function(pattern) {
		board.setUniverse(new Universe({
			seed: {
				type: pattern === 'random' ? 'random' : 'pattern',
				pattern
			},
			width: universe.width,
			height: universe.height
		}));
	}
});