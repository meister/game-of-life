var $ = require('jquery'),
	_ = require('lodash'),

defaultOptions = {
	container: 'body',
	cellSize: 3
},

Board = function(options) {
	this.options = _.extend({}, defaultOptions, options);
	this.universe = this.options.universe;
	this.$container = $(this.options.container);
	this.build();
};

Board.prototype.build = function() {
	this.$header = $('<h4>').appendTo(this.$container);
	this.$canvas = $('<canvas>').appendTo(this.$container);
	this.canvas = this.$canvas.get(0);
	this.setDimensions();
};

Board.prototype.setDimensions = function() {
	var width = parseInt(this.$canvas.width() / this.options.cellSize, 10),
		height = parseInt(this.$canvas.height() / this.options.cellSize, 10);

	this.universe.setDimensions(width, height);
	this.universe.seedUniverse();

	this.$canvas.attr({
		width: this.universe.width * this.options.cellSize,
		height: this.universe.height * this.options.cellSize
	});
};

Board.prototype.setUniverse = function(universe) {
	this.options.universe = universe;
	this.universe = universe;
};

Board.prototype.renderCells = function() {
	var context = this.canvas.getContext('2d'),
		universe = this.universe;

	this.$header.text('Generation: ' + (universe.generation || 0));

	function drawDot(row, col, color) {
		context.fillStyle = color || 'black';
		context.fillRect(
			col * this.options.cellSize,
			row * this.options.cellSize,
			this.options.cellSize,
			this.options.cellSize
		);
	}

	if (universe.delta) {
		// Draw live cells
		universe.delta.live.forEach(function(pos) {
			drawDot.call(this, pos.row, pos.col, 'black');
		}.bind(this));

		// Dead cells
		universe.delta.dead.forEach(function(pos) {
			drawDot.call(this, pos.row, pos.col, 'white');
		}.bind(this));
	}
};

module.exports = Board;