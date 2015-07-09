var $ = require('jquery'),
	_ = require('lodash'),

defaultOptions = {
	height: 10,
	width: 10,
	container: 'body'
},

Table = function(options) {
	this.options = _.extend({}, defaultOptions, options);
	this.$container = $(this.options.container);
	this.build(this.options.width, this.options.height, this.options.cellSize);
};

Table.prototype.build = function() {
	var row, column,
		$row, $cell,
		cid;

	this.$table = $('<table>').appendTo(this.$container);

	for (row = 0; row < this.options.height; row++) {
		$row = $('<tr>');

		for (column = 0; column < this.options.width; column++) {
			cid = 'c.' + row + '.' + column;
			$cell = $('<td>').attr('data-cid', cid).appendTo($row);
		}

		$row.appendTo(this.$table);
	}
};

Table.prototype.renderCells = function(cells) {
	var row, column;

	function getCell(row, column) {
		if (typeof cells[row] !== 'undefined' && cells[row][column] !== 'undefined') {
			return cells[row][column];
		}

		return false;
	}

	for (row = 0; row < this.options.height; row++) {
		for (column = 0; column < this.options.width; column++) {
			this.$table.find('[data-cid="c.' + row + '.' + column + '"]')
				.addClass(getCell(row, column) ? 'live' : 'dead');
		}
	}
};

module.exports = Table;