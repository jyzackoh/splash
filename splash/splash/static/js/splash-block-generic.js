splash.Block = function Block(parameters) {
	splash.Obj.call(this);

	this.parentLink = undefined;
	this.args = [];
	this.expressionBlockLinks = [];
	
	splash.Util.parseParameters(this, parameters);

	for(var i = 0; i < this.expectedArgsCount; i++) {
		this.expressionBlockLinks[i] = new splash.ExpressionBlockLink({parent: this});
	}

	this.htmlElement = this.render();
	this.nextBlockLink = new splash.BlockLink({parent: this, htmlElementToAttachBlockTo: this.htmlElement});
}
splash.Util.inherits(splash.Block, splash.Obj);
splash.Block.prototype.name = "Block";
splash.Block.prototype.colour = "default";
splash.Block.prototype.step = 5;
splash.Block.prototype.expectedArgsCount = 0;
splash.Block.prototype.inputLimits = [];
splash.Block.prototype.postExecutionDelay = 0;
splash.Block.prototype.codeSnippet = function() {};
splash.Block.prototype.render = function() {
	var htmlElement = $('<div></div>');
  return htmlElement;
};
// Sub-classes should not overwrite the following functions (i.e. "final methods")
splash.Block.prototype.setNextBlockLink = function(nextBlock) {
	this.nextBlockLink.child = nextBlock;
	nextBlock.parentLink = this.nextBlockLink; // the blocklink
};
splash.Block.prototype.getNextBlockLink = function() {
	return this.nextBlockLink.child;
};
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
	
	returnObject.blockArgValues = [];

	for (var i = 0; i < this.expectedArgsCount; i++) {
		returnObject.blockArgValues.push(this.htmlElement.find(".block-arg").eq(i).val());
	}

	return returnObject;
};
splash.Block.prototype.deserialize = function(obj) {
	splash.Obj.prototype.deserialize.call(this, obj);

	if(obj.positionInfo != undefined) {
		this.positionInfo = _.clone(obj.positionInfo);
	}

	for (var i = 0; i < this.expectedArgsCount; i++) {
		this.htmlElement.find(".block-arg").eq(i).val(obj.blockArgValues[i]);
	}
};

splash.ExpressionBlock = function ExpressionBlock(parameters) {
	splash.Block.call(this);

	this.args = [];

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ExpressionBlock, splash.Block);
splash.ExpressionBlock.prototype.render = function() {
	var htmlElement = $("<div></div>")
	.draggable({
		start: _.partial(splash.DragDropController.unchainAndDrawExpressionDroppables, this),
		stop: _.partial(splash.DragDropController.cleanupAndClearExpressionDroppables, this),
		zIndex: 1000,
		refreshPositions: true,
		helper: "clone",
		appendTo: ".canvas"
	});

	return htmlElement;
}

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

splash.StatementBlockLink = function StatementBlockLink(parameters) {
	splash.BlockLink.call(this);

	this.parent = undefined; // this should _not_ change after construction as each blocklink is tied permanently to a link (only child should change)
	this.attachPath = "";
	this.child = undefined;

	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.StatementBlockLink, splash.BlockLink);
splash.StatementBlockLink.prototype.render = function() {
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