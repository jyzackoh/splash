var splash = splash || {};


splash.Obj = function Obj(parameters) {
	this.serializeId = 0;
	splash.Util.parseParameters(this, parameters);
}

splash.Obj.prototype.serialize = function(splashObjectId) {
	this.serializeId = splashObjectId;

	//splash.Serializer.serialize()
	var returnObject = {
		type: "splashObject",
		class: this.constructor.name,
		serializeId: splashObjectId,
		value: {}
	};

	_.forOwn(this, function(value, key) {
		if(key.match("^htmlElement"))
			return; // We ignore all jQuery references

		if(key == "serializeId")
			return;
		returnObject.value[key] = splash.Serializer.serialize(value);
	});

	return returnObject;
};

splash.Obj.prototype.deserialize = function(obj) {
	var parameters = {};

	for(var i in obj.value) {
		parameters[i] = splash.Serializer.deserialize(obj.value[i]);
	}

	var returnObject = new splash[obj.class](parameters);

	return returnObject;
};

splash.BlockLink = function BlockLink(parameters) {
	splash.Obj.call(this);
	
	this.parent = undefined; // this should _not_ change after construction as each blocklink is tied permanently to a link (only child should change)
	this.htmlElementToAttachBlockTo = undefined;
	this.child = undefined;
	
	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
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

splash.Block = function Block(parameters) {
	splash.Obj.call(this);

	this.parentLink = undefined;
	this.args = [];
	
	splash.Util.parseParameters(this, parameters);

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
	var that = this;
	var inputInjector = function() {
		var returnString = '';
		for (var i = 0; i < that.expectedArgsCount; i++) {
			// returnString += '<input class="block-arg" type="number" maxlength="3" min="0" max="'+ that.inputLimits[i] +'">';
			returnString += '<input class="block-arg" maxlength="3" min="0" max="'+ that.inputLimits[i] +'">';
		}
    return returnString;
	};

  var htmlElement = $('<div class="block-drag-area"><div class="block block-'+ that.colour +'"><div class="block-signature"><div class="block-name">' + that.name + '</div><div class="block-args">'+ inputInjector() +'</div></div><div class="sub-blocks"></div></div></div>')
  .draggable({
    	start: _.partial(splash.DragDropController.unchainAndDrawDroppables, this),
    	stop: _.partial(splash.DragDropController.cleanupAndClearDroppables, this)
  });

  // NOTE: Does not trigger if first input is invalid!
	htmlElement.on("change", function() {
  	var listOfArgs = $(this).find('.block-arg');
		for (var i = 0; i < listOfArgs.length; i++) {
			var inputField = $(listOfArgs[i]);
			console.log("Change Detected");
			console.log(inputField.val());
			console.log(inputField.val().length);

			if (isNaN(parseInt(inputField.val()))) {
				inputField.val(0);
			} else {
				if (inputField.val() > that.inputLimits[i]) {
					inputField.val(that.inputLimits[i]);
				}
				if (inputField.val() < 0) {
					inputField.val(0);
				}
			}

	  	that.args[i] = inputField.val();
		}
	});

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

	return returnObject;
};
splash.Block.prototype.deserialize = function(obj) {
	var returnObject = splash.Obj.prototype.deserialize.call(this, obj);

	if(obj.positionInfo != undefined) {
		returnObject.positionInfo = _.clone(obj.positionInfo);
	}

	return returnObject;
};

//Set X Block
splash.SetXBlock = function SetXBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SetXBlock, splash.Block);
splash.SetXBlock.prototype.name = "Set X to";
splash.SetXBlock.prototype.colour = "crimson";
splash.SetXBlock.prototype.expectedArgsCount = 1;
// NEED TO SET INPUTLIMITS DYNAMICALLY
splash.SetXBlock.prototype.inputLimits = [99];
splash.SetXBlock.prototype.codeSnippet = function() {
	var steps = this.args[0] * this.step;
	splash.SpriteManager.getCurrentSprite().setPosition("x", steps);
};

//Set Y Block
splash.SetYBlock = function SetYBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SetYBlock, splash.Block);
splash.SetYBlock.prototype.name = "Set Y to";
splash.SetYBlock.prototype.colour = "crimson";
splash.SetYBlock.prototype.expectedArgsCount = 1;
// NEED TO SET INPUTLIMITS DYNAMICALLY
splash.SetYBlock.prototype.inputLimits = [99];
splash.SetYBlock.prototype.codeSnippet = function() {
	var steps = this.args[0] * this.step;
	splash.SpriteManager.getCurrentSprite().setPosition("y", steps);
};

//Show Block
splash.ShowBlock = function ShowBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ShowBlock, splash.Block);
splash.ShowBlock.prototype.name = "Show";
splash.ShowBlock.prototype.colour = "goldenrod";
splash.ShowBlock.prototype.codeSnippet = function() {
	splash.SpriteManager.getCurrentSprite().setVisibility(true);
};

//Hide Block
splash.HideBlock = function HideBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.HideBlock, splash.Block);
splash.HideBlock.prototype.name = "Hide";
splash.HideBlock.prototype.colour = "gold";
splash.HideBlock.prototype.codeSnippet = function() {
	splash.SpriteManager.getCurrentSprite().setVisibility(false);
};

//Move X Block
splash.MoveXBlock = function MoveXBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MoveXBlock, splash.Block);
splash.MoveXBlock.prototype.name = "Step along X by";
splash.MoveXBlock.prototype.colour = "forestgreen";
splash.MoveXBlock.prototype.expectedArgsCount = 1;
splash.MoveXBlock.prototype.inputLimits = [99];
splash.MoveXBlock.prototype.postExecutionDelay = 410;
splash.MoveXBlock.prototype.codeSnippet = function() {
	var steps = this.args[0] * this.step;
	splash.SpriteManager.getCurrentSprite().translate("x", steps);
};

//Move Y Block
splash.MoveYBlock = function MoveYBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MoveYBlock, splash.Block);
splash.MoveYBlock.prototype.name = "Step along Y by";
splash.MoveYBlock.prototype.colour = "forestgreen";
splash.MoveYBlock.prototype.expectedArgsCount = 1;
splash.MoveYBlock.prototype.inputLimits = [99];
splash.MoveYBlock.prototype.postExecutionDelay = 410;
splash.MoveYBlock.prototype.codeSnippet = function() {
	var steps = this.args[0] * this.step;
	splash.SpriteManager.getCurrentSprite().translate("y", steps);
};

//Wait Block
splash.WaitBlock = function WaitBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.WaitBlock, splash.Block);
splash.WaitBlock.prototype.name = "Wait for";
splash.WaitBlock.prototype.colour = "dodgerblue";
splash.WaitBlock.prototype.expectedArgsCount = 1;
splash.WaitBlock.prototype.postExecutionDelay = 0;
splash.WaitBlock.prototype.inputLimits = [99];
splash.WaitBlock.prototype.codeSnippet = function() {
	this.postExecutionDelay = this.args[0] * 1000; // to seconds
};

//Repeat Block
splash.RepeatBlock = function RepeatBlock(parameters) {
	splash.Block.call(this);

	// this.repeatSubBlocksLink = new splash.BlockLink({parent: this, htmlElementToAttachBlockTo: this.htmlElement.find(".sub-blocks")});

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.RepeatBlock, splash.Block);
splash.RepeatBlock.prototype.name = "Repeat for";
splash.RepeatBlock.prototype.colour = "midnightblue";
splash.RepeatBlock.prototype.expectedArgsCount = 1;
splash.RepeatBlock.prototype.inputLimits = [20];
splash.RepeatBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};
// splash.RepeatBlock.prototype.render = function() {
// 	var htmlElement = splash.Block.prototype.render.call(this);

// 	htmlElement.find(".sub-blocks").css({
// 		"min-width": "180px",
// 		"padding-top": "5px"
// 	});
// 	$('<div class="sub-blocks-buffer"></div>').insertAfter(htmlElement.find(".sub-blocks"));

// 	htmlElement.find(".sub-blocks").append(splash.Renderer.renderBlockChain());

// 	return htmlElement;
// };

//Change Costume Block
splash.ChangeCostumeBlock = function ChangeCostumeBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ChangeCostumeBlock, splash.Block);
splash.ChangeCostumeBlock.prototype.name = "Change costume to";
splash.ChangeCostumeBlock.prototype.colour = "indigo";
splash.ChangeCostumeBlock.prototype.expectedArgsCount = 1;
splash.ChangeCostumeBlock.prototype.inputLimits = [2];
splash.ChangeCostumeBlock.prototype.codeSnippet = function() {
	splash.SpriteManager.getCurrentSprite().changeCostume(this.args[0]);
};

//Change Background Block
splash.ChangeBackgroundBlock = function ChangeBackgroundBlock(parameters) {
	splash.Block.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ChangeBackgroundBlock, splash.Block);
splash.ChangeBackgroundBlock.prototype.name = "Change background to";
splash.ChangeBackgroundBlock.prototype.colour = "plum";
splash.ChangeBackgroundBlock.prototype.expectedArgsCount = 1;
splash.Block.prototype.inputLimits = [2];
splash.ChangeBackgroundBlock.prototype.codeSnippet = function() {
	this.args.sprite.isVisible = false;
};

splash.Sprite = function Sprite(parameters) {
	splash.Util.parseParameters(this, parameters);
	splash.Obj.call(this);
	this.firstLevelBlocks = [];
	this.isVisible = true;
	this.htmlElement = this.render();
}
splash.Util.inherits(splash.Sprite, splash.Obj);
splash.Sprite.prototype.costumes = [];
splash.Sprite.prototype.addFirstLevelBlock = function(block) {
	this.firstLevelBlocks.push(block);
}
splash.Sprite.prototype.removeFirstLevelBlock = function(block) {
	var index = this.firstLevelBlocks.indexOf(block);
		if(index != -1)
			this.firstLevelBlocks.splice(index, 1);
}
splash.Sprite.prototype.render = function() {
  var htmlElement = $('<img class="sprite" src="'+ this.costumes[0] +'">');

  htmlElement.one("load", function(){
  	var yCentreOffset = -htmlElement.prop("naturalHeight")/2;
  	var xCentreOffset = -htmlElement.prop("naturalWidth")/2;

    htmlElement.css({
	  	"margin-bottom": yCentreOffset +"px",
	  	"margin-left" :  xCentreOffset + "px",
	  });
  });

  return htmlElement;
}
splash.Sprite.prototype.changeCostume = function(index) {
	this.htmlElement.attr('src', this.costumes[index]);
}
splash.Sprite.prototype.setVisibility = function(visibilityValue) {
	visibilityValue ? this.htmlElement.show() : this.htmlElement.hide();
}
splash.Sprite.prototype.setPosition = function(axis, value) {
	if (axis == "y") {
		splash.SpriteManager.getCurrentSprite().htmlElement.css("bottom", value + "px");
	} else if (axis == "x") {
		splash.SpriteManager.getCurrentSprite().htmlElement.css("left", value + "px");
	}
}
splash.Sprite.prototype.translate = function(axis, value) {
	if (axis == "y") {
		splash.SpriteManager.getCurrentSprite().htmlElement.animate({"bottom": "+=" + value + "px"});
	} else if (axis == "x") {
		splash.SpriteManager.getCurrentSprite().htmlElement.animate({"left": "+=" + value + "px"});
	}
}}

splash.Background = function Background(parameters) {
	splash.Obj.call(this);
	
	this.name = "Default";
	this.url = "background_default.png"
	
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.Background, splash.Obj);