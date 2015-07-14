var $ = require('jquery'),
	_ = require('lodash'),
	seedPatterns = require('./seed-patterns'),

bindManualControls = function(board) {
	board.$container.find('.control-button').on('click', this.nextCycle.bind(this));
	board.$container.find('.control-seed')
		.on('change', this.resetCycle.bind(this));
},

bindAutomaticControls = function(board) {
	board.$container.find('.control-button')
		.on('click', function(ev) {
			var paused = this.pauseCycle();
			$(ev.target).text(paused ? 'Resume' : 'Pause');
		}.bind(this))
		.text(this.paused ? 'Resume' : 'Pause');
	board.$container.find('.control-seed')
		.on('change', this.resetCycle.bind(this));
},

fillSelect = function(board) {
	var $select = board.$container.find('.control-seed'),
		$optgroup = $select.find('optgroup'),
		$opt;

	_.each(seedPatterns, function(value, key) {
		$opt = $('<option>').val(key).text(key.replace(/-/g, ' '));
		$optgroup.append($opt);
	});
},

CycleController = function(options) {
	this.options = options;
	this.paused = false;
	this.board = this.options.board;

	fillSelect.call(this, this.board);

	this.initialize();
};

CycleController.prototype.initialize = function() {
	if (!this.options.cycle) {
		bindManualControls.call(this, this.board);
	} else {
		this.pauseCycle();
		bindAutomaticControls.call(this, this.board);
	}

	this.board.renderCells(this.options.universe);
};

CycleController.prototype.nextCycle = function() {
	this.board.universe.evolve();
	this.board.renderCells();
};

CycleController.prototype.pauseCycle = function() {
	this.paused = !this.paused;

	if (this.paused) {
		clearInterval(this.cycleTimer);
	} else {
		this.cycleTimer = setInterval(this.nextCycle.bind(this), this.options.cycle);
	}

	return this.paused;
};

CycleController.prototype.resetCycle = function(ev) {
	this.board.$container.find('.control-button').off('click');
	this.board.$container.find('.control-seed').off('change');
	clearInterval(this.cycleTimer);
	this.paused = false;

	if (typeof this.options.onChangeSeed === 'function') {
		this.options.onChangeSeed($(ev.target).val());
	}

	this.board.universe.seedUniverse();
	this.initialize();
};

module.exports = CycleController;