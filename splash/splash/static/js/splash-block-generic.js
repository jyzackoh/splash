splash.Block = function Block(parameters) {
	splash.Obj.call(this);

	this.parentLink = undefined;
	this.args = [];
	this.expressionBlockLinks = [];
	
	splash.Util.parseParameters(this, parameters);

	for(var i = 0; i < this.expectedArgsCount; i++) {
		this.args[i] = 0;
		this.expressionBlockLinks[i] = new splash.ExpressionBlockLink({parent: this});
	}

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.Block, splash.Obj);
splash.Block.prototype.name = "Block";
splash.Block.prototype.colour = "default";
splash.Block.prototype.expectedArgsCount = 0;
splash.Block.prototype.inputLimits = [];
splash.Block.prototype.postExecutionDelay = 0;
splash.Block.prototype.codeSnippet = function() {};
splash.Block.prototype.render = function() {
	var htmlElement = $('<div></div>');
  return htmlElement;
};
// Sub-classes should not overwrite the following functions (i.e. "final methods")
splash.Block.prototype.removeParentLink = function() {
	this.parentLink.child = undefined;
	this.parentLink = undefined;
};
splash.Block.prototype.serialize = function(splashObjectId) {
	var returnObject = splash.Obj.prototype.serialize.call(this, splashObjectId);

	if(this.htmlElement.css("position") == "absolute") {
		returnObject.positionInfo = {
			left: this.htmlElement.position().left,
			top: this.htmlElement.position().top
		};
	}

	return returnObject;
};
splash.Block.prototype.deserialize = function(obj) {
	splash.Obj.prototype.deserialize.call(this, obj);

	if(obj.positionInfo != undefined) {
		this.positionInfo = _.clone(obj.positionInfo);
	}
};








splash.ExpressionBlock = function ExpressionBlock(parameters) {
	splash.Block.call(this);

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ExpressionBlock, splash.Block);
splash.ExpressionBlock.prototype.render = function() {
	var that = this;

	var htmlElement = $("<div></div>")
	.addClass("block-expression")
	.draggable({
		start: _.partial(splash.DragDropController.unchainAndDrawExpressionDroppables, this),
		stop: _.partial(splash.DragDropController.cleanupAndClearExpressionDroppables, this),
		zIndex: 1000,
		refreshPositions: true,
		helper: "clone",
		appendTo: ".canvas"
	});

	htmlElement.tooltip({
		container: "body",
		title: function() {
			return "" + that.codeSnippet();
		}
	});

	return htmlElement;
}







splash.ChainableBlock = function ChainableBlock(parameters) {
	splash.Block.call(this);

	splash.Util.parseParameters(this, parameters);

	this.nextBlockLink = new splash.ChainableBlockLink({parent: this});

	this.subBlocksLinks = [];
}
splash.Util.inherits(splash.ChainableBlock, splash.Block);
splash.ChainableBlock.prototype.allowChildrenBlocks = true;
splash.ChainableBlock.prototype.render = function() {
	var that = this;

	var htmlElement = $('<div class="block-drag-area"><div class="block-statement block-'+ that.colour +'"><div class="block-signature"><div class="block-name block-text-outline">' + that.name + '</div></div><div class="sub-blocks"></div></div></div>')
	.draggable({
		start: _.partial(splash.DragDropController.unchainAndDrawDroppables, this),
		stop: _.partial(splash.DragDropController.cleanupAndClearDroppables, this),
		zIndex: 1000,
		refreshPositions: true,
		helper: "clone",
		appendTo: ".canvas"
	});

	return htmlElement;
}
splash.ChainableBlock.prototype.serialize = function(splashObjectId) {
	var returnObject = splash.Block.prototype.serialize.call(this, splashObjectId);

	returnObject.blockArgValues = [];

	for (var i = 0; i < this.expectedArgsCount; i++) {
		returnObject.blockArgValues.push(
			this.htmlElement.find('> .block-statement > .block-signature > .block-arg-wrapper > .block-arg').eq(i).val()
		);
	}

	return returnObject;
};

splash.ChainableBlock.prototype.deserialize = function(obj) {
	splash.Block.prototype.deserialize.call(this, obj);

	for (var i = 0; i < this.expectedArgsCount; i++) {
		this.htmlElement.find('> .block-statement > .block-signature > .block-arg-wrapper > .block-arg').eq(i).val(obj.blockArgValues[i]);
	}
};















// ======================================================== BlockLinks ======================================================

splash.BlockLink = function BlockLink(parameters) {
	splash.Obj.call(this);
	
	this.parent = undefined; // this should _not_ change after construction as each blocklink is tied permanently to a link (only child should changeoa	this.attachPath = undefined;
	this.attachPath = "";
	this.child = undefined;
	
	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.BlockLink, splash.Obj);
splash.BlockLink.prototype.render = function() {
	return $("<div></div>");
}
splash.BlockLink.prototype.getAttachHtmlElement = function() {
	if(this.attachPath == "")
		return this.parent.htmlElement;
	return this.parent.htmlElement.find(this.attachPath);
}









splash.ChainableBlockLink = function ChainableBlockLink(parameters) {
	splash.BlockLink.call(this);

	this.parent = undefined; // this should _not_ change after construction as each blocklink is tied permanently to a link (only child should change)
	this.attachPath = "";
	this.child = undefined;

	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.ChainableBlockLink, splash.BlockLink);
splash.ChainableBlockLink.prototype.render = function() {
	var htmlElement = $('<div class="chain-snap-area"></div>')
		.droppable({
			hoverClass: "drag-hover",
			tolerance: "pointer",
			drop: _.partial(splash.DragDropController.snapAreaDropHandler, this)
		});
    return htmlElement;
}









splash.ExpressionBlockLink = function ExpressionBlockLink(parameters) {
	splash.BlockLink.call(this);

	this.parent = undefined;
	this.attachPath = "> .block-signature > .block-arg-wrapper";
	this.child = undefined;

	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.ExpressionBlockLink, splash.BlockLink);
splash.ExpressionBlockLink.prototype.render = function() {
	var htmlElement = $('<div class="expression-snap-area"></div>')
		.droppable({
			hoverClass: "drag-hover",
			tolerance: "pointer",
			drop: _.partial(splash.DragDropController.expressionSnapAreaDropHandler, this)
		});
    return htmlElement;
}