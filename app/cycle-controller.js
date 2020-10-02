const $ = require('jquery');

const _ = require('lodash');
const seedPatterns = require('./seed-patterns');

const bindManualControls = function(board) {
	board.$container.find('.control-button').on('click', this.nextCycle.bind(this));
	board.$container.find('.control-seed')
		.on('change', this.resetCycle.bind(this));
};

const bindAutomaticControls = function(board) {
	board.$container.find('.control-button')
		.on('click', (ev) => {
			const paused = this.pauseCycle();

			$(ev.target).text(paused ? 'Resume' : 'Pause');
		})
		.text(this.paused ? 'Resume' : 'Pause');
	board.$container.find('.control-seed')
		.on('change', this.resetCycle.bind(this));
};

const fillSelect = function(board) {
	const $select = board.$container.find('.control-seed');

	const $optgroup = $select.find('optgroup');

	let $opt;

	_.each(seedPatterns, (value, key) => {
		$opt = $('<option>').val(key).text(key.replace(/-/g, ' '));
		$optgroup.append($opt);
	});
};

const CycleController = function(options) {
	this.options = options;
	this.paused = false;
	this.board = this.options.board;

	fillSelect.call(this, this.board);

	this.initialize();
};

CycleController.prototype.initialize = function() {
	if (this.options.cycle) {
		this.pauseCycle();
		bindAutomaticControls.call(this, this.board);
	} else {
		bindManualControls.call(this, this.board);
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