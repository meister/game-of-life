var _ = require('lodash'),
	seedPatterns = require('./seed-patterns'),

evolveCells = function(fn) {
	var row, column, state,
		cells = [],
		delta = {
			'live': [],
			'dead': []
		};

	for (row = 0; row < this.height; row++) {
		cells[row] = [];
		for (column = 0; column < this.width; column++) {
			state = fn.call(this, row, column);
			// console.log(row, column, state);

			if (!this.cells || (state !== this.cells[row][column])) {
				delta[state ? 'live' : 'dead'].push({row: row, col: column});
			}

			cells[row][column] = state;
		}
	}

	this.delta = delta;
	this.cells = cells;
},

countNeighbours = function(row, column) {
	var count = 0,

		prevrow = row - 1 < 0 ? this.height - 1 : row - 1,
		nextrow = row + 1 >= this.height ? 0 : row + 1,

		prevCol = column - 1 < 0 ? this.width - 1 : column - 1,
		nextCol = column + 1 >= this.width ? 0 : column + 1;

	/* jscs:disable */
	if (this.cells[prevrow][prevCol]) { count++; }
	if (this.cells[prevrow][column]) { count++; }
	if (this.cells[prevrow][nextCol]) { count++; }

	if (this.cells[row][prevCol]) { count++; }
	if (this.cells[row][nextCol]) { count++; }

	if (this.cells[nextrow][prevCol]) { count++; }
	if (this.cells[nextrow][column]) { count++; }
	if (this.cells[nextrow][nextCol]) { count++; }
	/* jscs:enable */

	return count;
},

defaultOptions = {
	seed: {
		type: 'random'
	}
},

Universe = function(options) {
	this.options = _.extend({}, defaultOptions, options);
	this.width = this.options.width || 50;
	this.height = this.options.height || 50;
	this.generation = 0;
};

Universe.prototype.setDimensions = function(width, height) {
	this.width = width || this.width;
	this.height = height || this.height;
};

Universe.prototype.seedUniverse = function() {
	evolveCells.call(this, function(row, column) {
		// Custom seed function
		if (typeof this.options.seed === 'function') {
			return this.options.seed.call(this, row, column);
		} else if (typeof this.options.seed === 'object') {
			// Patterns
			if (this.options.seed.type === 'pattern' && seedPatterns.hasOwnProperty(this.options.seed.pattern)) {
				 return this.getStateFromPattern(this.options.seed.pattern, row, column);
			}

			// Random seed
			if (this.options.seed.type === 'random') {
				return Math.random() > (this.options.seed.chance || 0.5);
			}
		}
	});
};

Universe.prototype.getStateFromPattern = function(pattern, row, column) {
	var data = seedPatterns[pattern],
		verticalAlignmentFix = parseInt((this.height - data.length) / 2, 10),
		alignedRow = row - verticalAlignmentFix;

	if (data.length > alignedRow && row >= verticalAlignmentFix && data[alignedRow].length > column) {
		return data[alignedRow][column].toUpperCase() === 'O';
	} else {
		return false;
	}
};

Universe.prototype.evolve = function() {
	evolveCells.call(this, function(row, column) {
		var myState = this.cells[row][column],
			state = myState,
			liveNeighbours = countNeighbours.call(this, row, column);

		/* Rules of Life */
		// underpopulation
		if (liveNeighbours < 2) {
			state = false;
		// overpopulation
		} else if (liveNeighbours > 3) {
			state = false;
		// reproduction
		} else if (myState === false && liveNeighbours === 3) {
			state = true;
		}

		return state;
	});

	this.generation++;
};

module.exports = Universe;