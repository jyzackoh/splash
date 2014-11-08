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

splash.SpriteXPositionBlock = function SpriteXPositionBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SpriteXPositionBlock, splash.VariableBlock);
splash.SpriteXPositionBlock.prototype.name = "Sprite X Position";
splash.SpriteXPositionBlock.prototype.colour = "default";
splash.SpriteXPositionBlock.prototype.codeSnippet = function(){
	return splash.SpriteManager.getCurrentSprite().getPosition().x;
};


splash.SpriteYPositionBlock = function SpriteYPositionBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SpriteYPositionBlock, splash.VariableBlock);
splash.SpriteYPositionBlock.prototype.name = "Sprite Y Position";
splash.SpriteYPositionBlock.prototype.colour = "default";
splash.SpriteYPositionBlock.prototype.codeSnippet = function(){
	return splash.SpriteManager.getCurrentSprite().getPosition().y;
};


splash.StageTopBlock = function StageTopBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageTopBlock, splash.VariableBlock);
splash.StageTopBlock.prototype.name = "Stage Top Position";
splash.StageTopBlock.prototype.colour = "default";
splash.StageTopBlock.prototype.codeSnippet = function(){
	return splash.SpriteManager.getCurrentSprite().getPosition();
};


splash.StageBottomBlock = function StageBottomBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageBottomBlock, splash.VariableBlock);
splash.StageBottomBlock.prototype.name = "Sprite Position";
splash.StageBottomBlock.prototype.colour = "default";
splash.StageBottomBlock.prototype.codeSnippet = function(){
	return splash.SpriteManager.getCurrentSprite().getPosition();
};


splash.StageLeftBlock = function StageLeftBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageLeftBlock, splash.VariableBlock);
splash.StageLeftBlock.prototype.name = "Sprite Position";
splash.StageLeftBlock.prototype.colour = "default";
splash.StageLeftBlock.prototype.codeSnippet = function(){
	return splash.SpriteManager.getCurrentSprite().getPosition();
};


splash.StageRightBlock = function StageRightBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageRightBlock, splash.VariableBlock);
splash.StageRightBlock.prototype.name = "Sprite Position";
splash.StageRightBlock.prototype.colour = "default";
splash.StageRightBlock.prototype.codeSnippet = function(){
	return splash.SpriteManager.getCurrentSprite().getPosition();
};


// splash.SpritePositionBlock = function SpritePositionBlock(parameters){
// 	splash.VariableBlock.call(this);
// 	splash.Util.parseParameters(this, parameters);
// }
// splash.Util.inherits(splash.SpritePositionBlock, splash.VariableBlock);
// splash.SpritePositionBlock.prototype.name = "Sprite Position";
// splash.SpritePositionBlock.prototype.colour = "default";
// splash.SpritePositionBlock.prototype.codeSnippet = function(){
// 	return splash.SpriteManager.getCurrentSprite().getPosition();
// };
