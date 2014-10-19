var splash = splash || {};


splash.Obj = function(parameters) {
	splash.Util.parseParameters(this, parameters);
}
splash.Obj.prototype.serialize = function() {};
splash.Obj.prototype.deserialize = function() {};

splash.BlockLink = function(parent, child, parameters) {
	splash.Obj.call(this);
	
	this.parent = parent; // this should _not_ change as each blocklink is tied permanently to a link (only child should change)
	this.child = child;
	this.htmlElement = this.render();
	
	splash.Util.parseParameters(this, parameters); //currently ignored
}
splash.Util.inherits(splash.BlockLink, splash.Obj);
splash.BlockLink.prototype.render = function() {
	var htmlElement = $('<div class="chain-snap-area"></div>')
		.droppable({
			hoverClass: "drag-hover",
			tolerance: "pointer",
			drop: _.partial(splash.DragDropController.snapAreaDropHandler, this)
		});
    return htmlElement;
}

splash.Block = function(parameters) {
	splash.Obj.call(this);

	this.nextBlockLink = new splash.BlockLink(this);
	this.parentLink = undefined;
	this.args = [];
	
	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.Block, splash.Obj);
splash.Block.prototype.name = "Block";
splash.Block.prototype.colour = "default";
splash.Block.prototype.expectedArgsCount = 0;
splash.Block.prototype.postExecutionDelay = 0;
splash.Block.prototype.codeSnippet = function() {};
splash.Block.prototype.render = function() {
	var that = this;
	var inputInjector = function() {
		var returnString = '';
		for (var i = 0; i < that.expectedArgsCount; i++) {
			returnString += '<input class="block-arg" maxlength="3">';
		}
    return returnString;
	};

  var htmlElement = $('<div class="block-drag-area"><div class="block block-'+ that.colour +'"><div class="block-signature"><div class="block-name">' + that.name + '</div><div class="block-args">'+ inputInjector() +'</div></div><div class="sub-blocks"></div></div></div>')
  .draggable({
    	start: _.partial(splash.DragDropController.unchainAndDrawDroppables, this),
    	stop: _.partial(splash.DragDropController.cleanupAndClearDroppables, this)
  });

	htmlElement.on("change", function() {
  		var listOfArgs = $(this).find('.block-arg');
		for (var i = 0; i < listOfArgs.length; i++) {
	  		that.args[i] = $(listOfArgs[i]).val();
		}
	});

  return htmlElement;
};
// Sub-classes should not overwrite the following functions (i.e. "final methods")
splash.Block.prototype.setNextBlockLink = function(nextBlock) {
	this.nextBlockLink.child = nextBlock;
	nextBlock.parentLink = this.nextBlockLink; // the blocklink
}
splash.Block.prototype.getNextBlockLink = function() {
	return this.nextBlockLink.child;
}
splash.Block.prototype.removeParentLink = function() {
	this.parentLink.child = undefined;
	this.parentLink = undefined;
}

//Set X Block
splash.SetXBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SetXBlock, splash.Block);
splash.SetXBlock.prototype.name = "Set X to";
splash.SetXBlock.prototype.colour = "crimson";
splash.SetXBlock.prototype.expectedArgsCount = 1;
splash.SetXBlock.prototype.codeSnippet = function() {
	this.args.sprite.x = this.args.point;
};


//Set Y Block
splash.SetYBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SetYBlock, splash.Block);
splash.SetYBlock.prototype.name = "Set Y to";
splash.SetYBlock.prototype.colour = "crimson";
splash.SetYBlock.prototype.expectedArgsCount = 1;
splash.SetYBlock.prototype.codeSnippet = function() {
	this.args.sprite.y = this.args.point;
};

//Show Block
splash.ShowBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ShowBlock, splash.Block);
splash.ShowBlock.prototype.name = "Show";
splash.ShowBlock.prototype.colour = "goldenrod";
splash.ShowBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = true;
};


//Hide Block
splash.HideBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.HideBlock, splash.Block);
splash.HideBlock.prototype.name = "Hide";
splash.HideBlock.prototype.colour = "gold";
splash.HideBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};



//Move X Block
splash.MoveXBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MoveXBlock, splash.Block);
splash.MoveXBlock.prototype.name = "Step along X by";
splash.MoveXBlock.prototype.colour = "forestgreen";
splash.MoveXBlock.prototype.expectedArgsCount = 1;
splash.MoveXBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};



//Move Y Block
splash.MoveYBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MoveYBlock, splash.Block);
splash.MoveYBlock.prototype.name = "Step along Y by";
splash.MoveYBlock.prototype.colour = "forestgreen";
splash.MoveYBlock.prototype.expectedArgsCount = 1;
splash.MoveYBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};

//Wait Block
splash.WaitBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.WaitBlock, splash.Block);
splash.WaitBlock.prototype.name = "Wait for";
splash.WaitBlock.prototype.colour = "dodgerblue";
splash.WaitBlock.prototype.expectedArgsCount = 1;
splash.WaitBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};


//Repeat Block
splash.RepeatBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.RepeatBlock, splash.Block);
splash.RepeatBlock.prototype.name = "Repeat for";
splash.RepeatBlock.prototype.colour = "midnightblue";
splash.RepeatBlock.prototype.expectedArgsCount = 1;
splash.RepeatBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};

//Change Costume Block
splash.ChangeCostumeBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ChangeCostumeBlock, splash.Block);
splash.ChangeCostumeBlock.prototype.name = "Change costume to";
splash.ChangeCostumeBlock.prototype.colour = "indigo";
splash.ChangeCostumeBlock.prototype.expectedArgsCount = 1;
splash.ChangeCostumeBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};

//Change Background Block
splash.ChangeBackgroundBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ChangeBackgroundBlock, splash.Block);
splash.ChangeBackgroundBlock.prototype.name = "Repeat for";
splash.ChangeBackgroundBlock.prototype.colour = "plum";
splash.ChangeBackgroundBlock.prototype.expectedArgsCount = 1;
splash.ChangeBackgroundBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};


splash.Sprite = function(parameters) {
	this.firstLevelBlocks = [];
	this.x = 0;
	this.y = 0;
	this.isVisible = true;
	splash.Util.parseParameters(this, parameters);
}
splash.Sprite.prototype.addFirstLevelBlock = function(block) {
	this.firstLevelBlocks.push(block);
}
splash.Sprite.prototype.removeFirstLevelBlock = function(block) {
	var index = this.firstLevelBlocks.indexOf(block);
		if(index != -1)
			this.firstLevelBlocks.splice(index, 1);
}
