var splash = splash || {};

splash.VariableBlock = function VariableBlock(parameters) {
	splash.ExpressionBlock.call(this);
	this.args = [];

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.VariableBlock, splash.ExpressionBlock);
splash.VariableBlock.prototype.expectedArgsCount = 0;
splash.VariableBlock.prototype.render = function(){
	var that = this;

	var htmlElement = splash.ExpressionBlock.prototype.render.call(this)
	// .addClass("block-variable")
	// .append($("..."));

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
