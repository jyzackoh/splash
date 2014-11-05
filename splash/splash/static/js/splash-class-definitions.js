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

	splash.Util.parseParameters(this, parameters);
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

splash.Sprite = function Sprite(parameters) {
	splash.Util.parseParameters(this, parameters);
	splash.Obj.call(this);

	if(!this.firstLevelBlocks)
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
  var htmlElement = $('<img class="sprite" src="/static/images/'+ this.costumes[0] +'">');

  htmlElement.one("load", function(){
  	var yCentreOffset = -htmlElement.prop("naturalHeight")/2;
  	var xCentreOffset = -htmlElement.prop("naturalWidth")/2;

    htmlElement.css({
	  	"margin-bottom": yCentreOffset + "px",
	  	"margin-left" :  xCentreOffset + "px",
	  });
  });

  return htmlElement;
}
splash.Sprite.prototype.changeCostume = function(index) {
	this.htmlElement.attr('src', "/static/images/" + this.costumes[index]);
}
splash.Sprite.prototype.setVisibility = function(visibilityValue) {
	visibilityValue ? this.htmlElement.show() : this.htmlElement.hide();
}
splash.Sprite.prototype.setPosition = function(axis, value) {
	if (axis == "y") {
		this.htmlElement.css("bottom", value + "px");
	} else if (axis == "x") {
		this.htmlElement.css("left", value + "px");
	}
}
splash.Sprite.prototype.getPosition = function() {
	var defaultPosition = this.htmlElement.position();
	var position = {
		x: defaultPosition.left,
		y: (StageManager.stageDimension.height - defaultPosition.top),
	}
	return position;
}
splash.Sprite.prototype.translate = function(axis, value) {
	if (axis == "y") {
		this.htmlElement.animate({"bottom": "+=" + value + "px"});
	} else if (axis == "x") {
		this.htmlElement.animate({"left": "+=" + value + "px"});
	}
}

splash.Background = function Background(parameters) {
	splash.Obj.call(this);
	
	this.name = "Default";
	this.url = "background_default.png"
	
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.Background, splash.Obj);