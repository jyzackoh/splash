var splash = splash || {};

splash.EventBlock = function EventBlock(parameters) {
	splash.Block.call(this);

	this.parentLink = undefined;
	this.args = [];
	
	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
	this.nextBlockLink = new splash.EventBlockLink({parent: this});
}
splash.Util.inherits(splash.EventBlock, splash.Block);
splash.EventBlock.prototype.inputLimits = [];
splash.EventBlock.prototype.render = function() {
	var that = this;
	var htmlElement = $('<div class="block-drag-area"><div class="block-event block-' + that.color +'"><div class="block-signature"><div class="block-name block-text-outline">' + that.name + '</div>' + inputInjector() + '</div></div></div>')
	.draggable({
		start: _.partial(splash.DragDropController.unchainAndDrawDroppables, this),
		stop: _.partial(splash.DragDropController.cleanupAndClearDroppables, this),
		zIndex: 1000,
		refreshPositions: true,
		helper: "clone",
		appendTo: ".canvas"
	});
	return htmlElement;
};

//On Space Block
splash.OnSpaceBlock = function OnSpaceBlock(parameters) {
	this.inputLimits = [{max: 100, min:0}];
	splash.EventBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.OnSpaceBlock, splash.EventBlock);
splash.OnSpaceBlock.prototype.name = "Set X to";
splash.OnSpaceBlock.prototype.colour = "crimson";
splash.OnSpaceBlock.prototype.expectedArgsCount = 1;
splash.OnSpaceBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	var steps = this.args[0] * splash.StageManager.pixelsPerStep;
	splash.SpriteManager.getCurrentSprite().setPosition("x", steps);
};
