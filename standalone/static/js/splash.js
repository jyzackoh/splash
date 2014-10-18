var splash = splash || {};	


splash.Obj = function(parameters) {
	splash.Util.parseParameters(this, parameters);
}
splash.Obj.prototype.serialize = function() {};
splash.Obj.prototype.deserialize = function() {};


splash.Block = function(parameters) {
	splash.Obj.call(this);

	this.nextBlockLink = new splash.BlockLink(this);
	this.parentLink = undefined;
	this.args = [];
	this.htmlElement = this.render();

	splash.Util.parseParameters(this, parameters);
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

  var htmlElement = $('<div class="chain"><div class="block block-'+ that.colour +'"><div class="block-signature"><div class="block-name">' + that.name + '</div><div class="block-args">'+ inputInjector() +'</div></div><div class="sub-blocks"></div></div></div>')
  .draggable({
      helper: _.partial(splash.Renderer.blockDragHelper, this),
      appendTo: "body"
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
splash.Block.prototype.setnextBlockLink = function(nextBlockLink) {
	this.nextBlockLink.child = nextBlockLink;
	nextBlockLink.parentLink = this.nextBlockLink; // the blocklink
}
splash.Block.prototype.getnextBlockLink = function() {
	return this.nextBlockLink.child;
}
splash.Block.prototype.addFirstLevelBlock = function(block) {
	this.firstLevelBlocks.push(block);
}
splash.Block.prototype.removeFirstLevelBlock = function(block) {
	for(var i = 0; i < firstLevelBlocks.length; i++) {
		if(this.firstLevelBlocks[i] == block) {
			this.firstLevelBlocks.splice(i, 1);
			return true;
		}
	}
	return false;
}

//Set X Block
splash.setXBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.setXBlock, splash.Block);
splash.setXBlock.prototype.name = "Set X to";
splash.setXBlock.prototype.colour = "crimson";
splash.setXBlock.prototype.expectedArgsCount = 1;
splash.setXBlock.prototype.codeSnippet = function() {
	this.args.sprite.x = this.args.point;
};


//Set Y Block
splash.setYBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.setYBlock, splash.Block);
splash.setYBlock.prototype.name = "Set Y to";
splash.setYBlock.prototype.colour = "crimson";
splash.setYBlock.prototype.expectedArgsCount = 1;
splash.setYBlock.prototype.codeSnippet = function() {
	this.args.sprite.y = this.args.point;
};

//Show Block
splash.showBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.showBlock, splash.Block);
splash.showBlock.prototype.name = "Show";
splash.showBlock.prototype.colour = "goldenrod";
splash.showBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = true;
};


//Hide Block
splash.hideBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.hideBlock, splash.Block);
splash.hideBlock.prototype.name = "Hide";
splash.hideBlock.prototype.colour = "gold";
splash.hideBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};



//Move X Block
splash.moveXBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.moveXBlock, splash.Block);
splash.moveXBlock.prototype.name = "Step along X by";
splash.moveXBlock.prototype.colour = "forestgreen";
splash.moveXBlock.prototype.expectedArgsCount = 1;
splash.moveXBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};



//Move Y Block
splash.moveYBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.moveYBlock, splash.Block);
splash.moveYBlock.prototype.name = "Step along Y by";
splash.moveYBlock.prototype.colour = "forestgreen";
splash.moveYBlock.prototype.expectedArgsCount = 1;
splash.moveYBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};

//Wait Block
splash.waitBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.waitBlock, splash.Block);
splash.waitBlock.prototype.name = "Wait for";
splash.waitBlock.prototype.colour = "dodgerblue";
splash.waitBlock.prototype.expectedArgsCount = 1;
splash.waitBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};


//Repeat Block
splash.repeatBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.repeatBlock, splash.Block);
splash.repeatBlock.prototype.name = "Repeat for";
splash.repeatBlock.prototype.colour = "midnightblue";
splash.repeatBlock.prototype.expectedArgsCount = 1;
splash.repeatBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};

//Change Costume Block
splash.changeCostumeBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.changeCostumeBlock, splash.Block);
splash.changeCostumeBlock.prototype.name = "Change costume to";
splash.changeCostumeBlock.prototype.colour = "indigo";
splash.changeCostumeBlock.prototype.expectedArgsCount = 1;
splash.changeCostumeBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};

//Change Background Block
splash.changeBackgroundBlock = function(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.changeBackgroundBlock, splash.Block);
splash.changeBackgroundBlock.prototype.name = "Repeat for";
splash.changeBackgroundBlock.prototype.colour = "plum";
splash.changeBackgroundBlock.prototype.expectedArgsCount = 1;
splash.changeBackgroundBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};


splash.Sprite = function(parameters) {
	this.firstLevelBlocks = [];
	this.x = 0;
	this.y = 0;
	this.isVisible = true;
	splash.Util.parseParameters(this, parameters);
}


var abc1 = new splash.Block({});
var abc2 = new splash.setXBlock({});
var abc3 = new splash.setYBlock({});
var abc4 = new splash.showBlock({});
var abc5 = new splash.hideBlock({});
var abc6 = new splash.waitBlock({});
var abc7 = new splash.moveXBlock({});
var abc8 = new splash.moveYBlock({});
var abc9 = new splash.repeatBlock({});
var abc10 = new splash.changeCostumeBlock({});
var abc11 = new splash.changeBackgroundBlock({});

abc1.setnextBlockLink(abc2);
abc2.setnextBlockLink(abc3);
abc3.setnextBlockLink(abc4);
abc4.setnextBlockLink(abc5);
abc5.setnextBlockLink(abc6);
abc6.setnextBlockLink(abc7);
abc7.setnextBlockLink(abc8);
abc8.setnextBlockLink(abc9);
abc9.setnextBlockLink(abc10);
abc10.setnextBlockLink(abc11);
