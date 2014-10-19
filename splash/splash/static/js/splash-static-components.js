var splash = splash || {};

splash.Util = {
	partial: function() {
		var fn = arguments[0];
		Array.prototype.shift.call(arguments);
		var args = Array.prototype.slice.call(arguments);
		return function() {
			var arg = 0;
			for ( var i = 0; i < args.length && arg < arguments.length; i++)
				if ( args[i] === undefined )
					args[i] = arguments[arg++];
			return fn.apply(this, args);
		};
	},
	inherits: function(subClass, superClass) {
		if (_.isFunction(subClass) && _.isFunction(superClass)) {
			subClass.prototype = _.create(superClass.prototype, {'constructor': subClass});
		} else {
			throw new Error('Only class definitions can inherit other class definitions.');
		}
	},
	parseParameters: function(that, parameters) {
		if(_.isPlainObject(parameters)) {
			for(var i in parameters) {
				that[i] = parameters[i];
			}
		}
	}
};

splash.Interpreter = {
	executeBlockChain: function(startingBlock, chainCallback) {
		startingBlock.codeSnippet.apply(this, startingBlock.args);
		
		if(startingBlock.nextBlockLink.child != undefined) {
			setTimeout(
				splash.Util.partial(splash.Interpreter.executeBlockChain, startingBlock.nextBlockLink.child, chainCallback),
				startingBlock.postExecutionDelay
			);
		}
		else if(chainCallback != undefined) {
			chainCallback();
		}
		//else do nothing... end of chain with no chain-callback defined.
	},
	runAllStripeBlocks: function(stripe) {
		_.forEach(stripe.firstLevelBlocks, function(startingBlock) {
			splash.Interpreter.executeBlockChain(startingBlock);
		});
	}
};

splash.SpriteManager = {
	currentSprite: undefined,
	spriteList: [],
	setCurrentSprite: function(sprite) {
		splash.SpriteManager.currentSprite = sprite;
	},
	getCurrentSprite: function(sprite) {
		return splash.SpriteManager.currentSprite;
	},
	addSprite: function(sprite) {
		splash.SpriteManager.spriteList.push(sprite);
	},
	removeSprite: function(sprite) {
		var index = splash.SpriteManager.spriteList.indexOf(sprite);
		if(index != -1)
			splash.SpriteManager.spriteList.splice(index, 1);
	}
};

splash.BackgroundManager = {
	currentBackground: undefined,
	backgroundList: [],
	setCurrentBackground: function(backgroundName) {
		var that = splash.BackgroundManager;
		for(var i in that.backgroundList) {
			if(that.backgroundList[i].name == backgroundName) {
				that.currentBackground = that.backgroundList[i];
				$(".stageOutput").css({
					"background-image": 'url("/static/images/' + that.currentBackground.url + '")'
				});
				break;
			}
		}
	},
	addBackground: function(background) {
		splash.BackgroundManager.backgroundList.push(background);
	},
	removeBackground: function(background) {
		var index = splash.BackgroundManager.backgroundList.indexOf(background);
		if(index != -1)
			splash.BackgroundManager.backgroundList.splice(index, 1);
	}
}

splash.Renderer = {
	renderBlockChain: function(startingBlock) {

		var currentBlock = startingBlock;

		while(true) {
			if(currentBlock.nextBlockLink.child == undefined) {
                break;
			}
			else {
				currentBlock.htmlElement.append(currentBlock.nextBlockLink.child.htmlElement);
				currentBlock.nextBlockLink.child.htmlElement.css({
					position: "relative"
				});

				currentBlock = currentBlock.nextBlockLink.child;
			}			
		}

		startingBlock.htmlElement.css({
			position: "absolute"
		});

		return startingBlock.htmlElement;
	}
};

splash.DragDropController = {
	currentDraggedBlock: {
		block: undefined,
		originalOffset: undefined,
		parentName: undefined
	},

	resetCurrentDraggedBlock: function() {
		splash.DragDropController.currentDraggedBlock = {
			block: undefined,
			originalOffset: undefined,
			parentName: undefined
		}
	},

	drawDroppables: function() {
		_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, function(startingBlock) {
			var currentBlock = startingBlock;
			while(true) {
				if(currentBlock.nextBlockLink.child != undefined) {
					currentBlock = currentBlock.nextBlockLink.child;
					continue;
				}

				currentBlock.nextBlockLink.htmlElement.insertAfter(currentBlock.htmlElement.children(".block"));
				break;
			}
		});
	},

	unchainAndDrawDroppables: function(draggedBlock) {
		// Unchain
		if(draggedBlock.parentLink != undefined) {
			draggedBlock.removeParentLink();
		}
		else {
			// Temporarily remove draggedBlock from the firstLevelBlocks list
			splash.SpriteManager.currentSprite.removeFirstLevelBlock(draggedBlock);
		}

		// Record dragged block
		splash.DragDropController.currentDraggedBlock.block = draggedBlock;
		splash.DragDropController.currentDraggedBlock.originalOffset = _.clone(draggedBlock.htmlElement.offset());
		splash.DragDropController.currentDraggedBlock.parentName = (draggedBlock.htmlElement.parent().is(".canvas") ? "canvas" : "nested");

		// Set z-index
		draggedBlock.htmlElement.css({
			"z-index": 1000
		});

		// Draw droppables
		splash.DragDropController.drawDroppables();
	},

	setupTemplateCloneAndDrawDroppables: function(blockName, event, ui) {
		// Record dragged block
		splash.DragDropController.currentDraggedBlock.block = new splash[blockName]();
		splash.DragDropController.currentDraggedBlock.originalOffset = _.clone(ui.helper.offset());
		splash.DragDropController.currentDraggedBlock.parentName = "template";

		// Set z-index
		ui.helper.css({
			"z-index": 1000
		});

		// Draw droppables
		splash.DragDropController.drawDroppables();
	},

	cleanupTemplateCloneAndClearDroppables: function(event, ui) {
		ui.helper.remove();
		splash.DragDropController.cleanupAndClearDroppables(splash.DragDropController.currentDraggedBlock.block, event, ui);
	},

	cleanupAndClearDroppables: function(draggedBlock, event, ui) {
		// Note: the drop handler will fire first.

		// Set z-index
		draggedBlock.htmlElement.css({
			"z-index": "auto"
		});

		// Check if block was dropped on a snap area (and hence has a parent)
		if(draggedBlock.parentLink == undefined) {
			$(".canvas").append(draggedBlock.htmlElement);
			draggedBlock.htmlElement.css({
				position: "absolute",
			});

			if(splash.DragDropController.currentDraggedBlock.parentName == "nested") {
				draggedBlock.htmlElement.css({
					top: splash.DragDropController.currentDraggedBlock.originalOffset.top + ui.position.top - $(".canvas").offset().top,
					left: splash.DragDropController.currentDraggedBlock.originalOffset.left + ui.position.left - $(".canvas").offset().left,
				});
			}
			else if(splash.DragDropController.currentDraggedBlock.parentName == "template") {
				draggedBlock.htmlElement.css({
					top: ui.offset.top - $(".canvas").offset().top,
					left: ui.offset.left - $(".canvas").offset().left,
				});
			}

			if(draggedBlock.htmlElement.position().left < -draggedBlock.htmlElement.width() + 10
				|| draggedBlock.htmlElement.position().top < -draggedBlock.htmlElement.children(".block-signature").height() + 10
				|| draggedBlock.htmlElement.position().left > $(".canvas").width() - 10
				|| draggedBlock.htmlElement.position().top > $(".canvas").height() - 10) { // Block is deleted
				draggedBlock.htmlElement.remove();
			}
			else {
				splash.SpriteManager.currentSprite.addFirstLevelBlock(draggedBlock);
			}
		}

		// Remove record of dragged block (note not all are cleared)
		//splash.DragDropController.resetCurrentDraggedBlock();

		// Clear droppables
		$(".chain-snap-area").detach();
	},

	snapAreaDropHandler: function(dropAreaLink) {
		dropAreaLink.parent.setNextBlockLink(splash.DragDropController.currentDraggedBlock.block);
		dropAreaLink.parent.htmlElement.append(splash.DragDropController.currentDraggedBlock.block.htmlElement);
		splash.DragDropController.currentDraggedBlock.block.htmlElement.css({
			position: "relative",
			top: "auto",
			left: "auto"
		});
	}
};

splash.Serializer = {
	splashObjectList: [],
	splashObjectSerializeId: 1,
	serializeInitial: function(obj) {
		var that = splash.Serializer;
		that.splashObjectSerializeId = 1;
		var returnObject = that.serialize(obj);
		that.serializeCleanup();
		return returnObject;
	},
	serialize: function(obj) {
		var that = splash.Serializer;
		var returnObject = {};

		if(obj instanceof splash.Obj) {
			if(obj.serializeId == 0) {
				that.splashObjectList.push(obj);
				returnObject = obj.serialize(that.splashObjectSerializeId++);
			}
			else {
				returnObject.type = "splashObjectReference";
				returnObject.serializeId = obj.serializeId;
			}
		}
		else if(_.isPlainObject(obj)) {
			var value = {};
			for(var i in obj) {
				value[i] = that.serialize(obj[i]);
			}

			returnObject.type = "plainObject";
			returnObject.value = value;
		}
		else if(_.isArray(obj)) {
			var value = [];
			for(var i in obj) {
				value.push(that.serialize(obj[i]));
			}

			returnObject.type = "array";
			returnObject.value = value;
		}
		else {
			returnObject.type = "primitive";
			returnObject.value = obj;
		}

		return returnObject;
	},
	serializeCleanup: function() {
		var that = splash.Serializer;
		while(that.splashObjectList.length != 0) {
			that.splashObjectList.pop().serializeId = 0;
		}
	},
	deserializeInitial: function(obj) {
		var that = splash.Serializer;
		var returnObject = that.deserialize(obj);
		that.deserializeCleanup();
		return returnObject;
	},
	deserialize: function(obj) {
		var that = splash.Serializer;
		var returnObject;

		if(obj.type == "splashObject") {
			var value = splash[obj.class].prototype.deserialize(obj);

			that.splashObjectList[obj.serializeId] = value;
			return value;
		}
		else if(obj.type == "splashObjectReference") {
			return that.splashObjectList[obj.value];
		}
		else if(obj.type == "plainObject") {
			var value = {};
			for(var i in obj) {
				value[i] = that.deserialize(obj[i]);
			}

			return value;
		}
		else if(obj.type == "array") {
			var value = [];
			for(var i in obj.value) {
				value.push(that.deserialize(obj.value[i]));
			}

			return value;
		}
		else { //obj.type == "primitive";
			return obj.value;
		}
	},
	deserializeCleanup: function(obj) {
		splash.Serializer.splashObjectList = [];
	}
}