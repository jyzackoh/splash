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