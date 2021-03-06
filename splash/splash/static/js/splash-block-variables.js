var splash = splash || {};

splash.VariableBlock = function VariableBlock(parameters) {
	splash.ExpressionBlock.call(this);
	this.args = [];

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.VariableBlock, splash.ExpressionBlock);
splash.VariableBlock.prototype.expectedArgsCount = 0;
splash.VariableBlock.prototype.color = "teal";
splash.VariableBlock.prototype.render = function() {
	var that = this;

	var htmlElement = splash.ExpressionBlock.prototype.render.call(this)
	.addClass("block-" + this.color)
	.append($('<div class="block-signature"><div class="block-name block-text-outline">&nbsp;'+ that.name +'&nbsp;</div></div>'));
	return htmlElement;
}

splash.SpriteXPositionBlock = function SpriteXPositionBlock(parameters) {
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SpriteXPositionBlock, splash.VariableBlock);
splash.SpriteXPositionBlock.prototype.name = "Sprite X Position";
splash.SpriteXPositionBlock.prototype.codeSnippet = function() {
	// Should return value relative to SPLASH!'s coordinate system (0-100 units)
	return Math.round(splash.SpriteManager.getCurrentSprite().getPosition().x/splash.StageManager.pixelsPerStep);
};


splash.SpriteYPositionBlock = function SpriteYPositionBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SpriteYPositionBlock, splash.VariableBlock);
splash.SpriteYPositionBlock.prototype.name = "Sprite Y Position";
splash.SpriteYPositionBlock.prototype.codeSnippet = function(){
	//Should return value relative to SPLASH!'s coordinate system (0-100 units)
	return Math.round(splash.SpriteManager.getCurrentSprite().getPosition().y/splash.StageManager.pixelsPerStep);
};


splash.StageTopBlock = function StageTopBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageTopBlock, splash.VariableBlock);
splash.StageTopBlock.prototype.name = "Stage Top Limit";
splash.StageTopBlock.prototype.codeSnippet = function(){
	return 99;
};


splash.StageBottomBlock = function StageBottomBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageBottomBlock, splash.VariableBlock);
splash.StageBottomBlock.prototype.name = "Stage Bottom Limit";
splash.StageBottomBlock.prototype.codeSnippet = function(){
	return 0;
};


splash.StageLeftBlock = function StageLeftBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageLeftBlock, splash.VariableBlock);
splash.StageLeftBlock.prototype.name = "Stage Left Limit";
splash.StageLeftBlock.prototype.codeSnippet = function(){
	return 0;
};


splash.StageRightBlock = function StageRightBlock(parameters){
	splash.VariableBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StageRightBlock, splash.VariableBlock);
splash.StageRightBlock.prototype.name = "Stage Right Limit";
splash.StageRightBlock.prototype.codeSnippet = function(){
	return 99;
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
