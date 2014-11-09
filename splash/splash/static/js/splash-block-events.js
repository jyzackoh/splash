var splash = splash || {};

splash.EventBlock = function EventBlock(parameters) {
	splash.ChainableBlock.call(this);
	
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.EventBlock, splash.ChainableBlock);

//On Space Block
splash.OnSpaceBlock = function OnSpaceBlock(parameters) {
	splash.EventBlock.call(this);

	splash.Util.parseParameters(this, parameters);

	this.subBlocksLinks[0] = new splash.ChainableBlockLink({parent: this, attachPath: "> .block-statement > .sub-blocks"});
}
splash.Util.inherits(splash.OnSpaceBlock, splash.EventBlock);
splash.OnSpaceBlock.prototype.name = "When Spacebar is Pressed";
splash.OnSpaceBlock.prototype.colour = "crimson";
splash.OnSpaceBlock.prototype.allowChildrenBlocks = false;
