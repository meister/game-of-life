const $ = require('jquery');

const _ = require('lodash');

const defaultOptions = {
	container: 'body',
	cellSize: 3
};

const Board = function(options) {
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
	const width = parseInt(this.$canvas.width() / this.options.cellSize, 10);

	const height = parseInt(this.$canvas.height() / this.options.cellSize, 10);

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
	const context = this.canvas.getContext('2d');

	const universe = this.universe;

	this.$header.text(`Generation: ${universe.generation || 0}`);

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
		universe.delta.live.forEach((pos) => {
			drawDot.call(this, pos.row, pos.col, 'black');
		});

		// Dead cells
		universe.delta.dead.forEach((pos) => {
			drawDot.call(this, pos.row, pos.col, 'white');
		});
	}
};

module.exports = Board;