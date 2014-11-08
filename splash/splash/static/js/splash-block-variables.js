var splash = splash || {};

splash.VariableBlock = function VariableBlock(parameters) {
	splash.Block.call(this);
	this.args = [];

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.VariableBlock, splash.Block);
splash.VariableBlock.prototype.expectedArgsCount = 1;
splash.VariableBlock.prototype.render = function(){
	var that = this;

	var htmlElement = $('stub')
	.draggable({
		start: _.partial(splash.DragDropController.unchainAndDrawDroppables, this),
		stop: _.partial(splash.DragDropController.cleanupAndClearDroppables, this)
	});

  return htmlElement;
}

splash.SpritePositionBlock = function SpritePositionBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SpritePositionBlock, splash.VariableBlock);
splash.SpritePositionBlock.prototype.name = "Sprite Position";
splash.SpritePositionBlock.prototype.colour = "default";
splash.SpritePositionBlock.prototype.codeSnippet = function(){
	return splash.SpriteManager.getCurrentSprite().getPosition();
};
