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
		startingBlock.codeSnippet();
		//startingBlock.codeSnippet.apply(this, startingBlock.args);
		
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
	getCurrentSprite: function() {
		return splash.SpriteManager.currentSprite;
	},
	addSprite: function(sprite) {
		splash.SpriteManager.spriteList.push(sprite);
		$(".stageOutput").append(sprite.htmlElement);

		sprite.setPosition("x", $(".stageOutput").width() / 2);
		sprite.setPosition("y", $(".stageOutput").height() / 2);
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
	setCurrentBackground: function(i) {
		var that = splash.BackgroundManager;
		// for(var i in that.backgroundList) {
		// 	if(that.backgroundList[i].name == backgroundName) {
				that.currentBackground = that.backgroundList[i];
				$(".stageOutput").css({
					"background-image": 'url("/static/images/' + that.currentBackground.url + '")'
				});
		// 		break;
		// 	}
		// }
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
		var drawDroppable = function(startingBlock) {
			var currentBlock = startingBlock;
			while(true) {
				// if(currentBlock instanceof splash.RepeatBlock) {
				// 	if(currentBlock.repeatSubBlocksLink.child == undefined) {
				// 		currentBlock.htmlElement.find(".sub-blocks").append(currentBlock.repeatSubBlocksLink.htmlElement);
				// 	}
				// 	else {

				// 		drawDroppable(currentBlock.repeatSubBlocksLink.child);
				// 	}
				// }

				if(currentBlock.nextBlockLink.child != undefined) {
					currentBlock = currentBlock.nextBlockLink.child;
					continue;
				}

				// //console.log(currentBlock.name);
				currentBlock.nextBlockLink.htmlElement.insertAfter(currentBlock.htmlElement.children(".block")); // Relook at the tree traversal
				break;
			}
		}

		_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, drawDroppable);
	},

	drawRepeatDroppables: function() {

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

	snapAreaDropHandler: function(dropAreaLink) {
		// Check if block was dropped on a snap area (and hence has a parent)... Prevent multiple-attachements
		if(splash.DragDropController.currentDraggedBlock.block.parentLink != undefined) {
			return;
		}
		dropAreaLink.child = splash.DragDropController.currentDraggedBlock.block;
		splash.DragDropController.currentDraggedBlock.block.parentLink = dropAreaLink;

		dropAreaLink.htmlElementToAttachBlockTo.append(splash.DragDropController.currentDraggedBlock.block.htmlElement);
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

splash.StageManager = {
	initialize: function() {
		splash.StageManager.initializeBackgrounds();
		splash.StageManager.initializeSprites();
		splash.StageManager.initializeButtons();
	},
	initializeBackgrounds: function() {
		splash.BackgroundManager.addBackground(new splash.Background({
			name: "beach",
			url: "background_beach.png"
		}));

		splash.BackgroundManager.addBackground(new splash.Background({
			name: "school",
			url: "background_school.png"
		}));

		splash.BackgroundManager.setCurrentBackground(0);
	},
	initializeSprites: function() {
		var newSprite = new splash.Sprite({costumes: ["happy_turtle.png", "happy_turtle2.png", "sad_turtle.png"]});
		splash.SpriteManager.addSprite(newSprite);
		splash.SpriteManager.setCurrentSprite(newSprite);
	},
	initializeButtons: function() {
		$("#playButton").on("click", function() {
			_.forEach(splash.SpriteManager.spriteList, function(sprite) {
				splash.Interpreter.runAllStripeBlocks(sprite);
			});
		});
		$("#stopButton").on("click", function() {
			;
		});
	}
}

splash.PageManager = {
	initialize: function() {
		splash.PageManager.load();

		$("#newButton").on("click", function() {
			location.replace("/new_program/");
		});
		$("#saveButton").on("click", function() {
			splash.PageManager.showMessage("Saving...");

			var saveData = JSON.stringify(splash.Serializer.serializeInitial(splash.SpriteManager.spriteList));
			$.post("save/", saveData, function(reply) {
				if(reply.success == "True") {
					splash.PageManager.showMessage("Saved!", true);
				}
				else {
					splash.PageManager.showMessage(reply.error, true);
				}
			}, "text");
		});
		$("#makePrivateButton").on("click", function() {
			$.get("perm/PR/", "", function(reply) {
				console.log(reply);
			}, "text");
		});
		$("#makePublicButton").on("click", function() {
			$.get("perm/PU/", "", function(reply) {
				console.log(reply);
			}, "text");
		});
	},
	load: function() {
		splash.PageManager.hideMessage();
		try {
			$.get("load/", "", function(reply) {
				var loadedObj = splash.Serializer.deserializeInitial(JSON.parse(reply.data));
				splash.SpriteManager.spriteList = loadedObj;
				splash.SpriteManager.setCurrentSprite(splash.SpriteManager.spriteList[0]);

				_forEach(splash.SpriteManager.getCurrentSprite().firstLevelBlocks, function(block) {
					var htmlElement = splash.Renderer.renderBlockChain(block);
					htmlElement.css({
						top: block.positionInfo.top,
						left: block.positionInfo.left
					});
					$(".canvas").append(htmlElement);
				});

				splash.PageManager.hideMessage();
			}, "text");
		}
		catch(e) {
			splash.PageManager.showMessage("An error occured while attempting to load the program.", true);
		}
	},
	showMessage: function(msg, closeButton) {
		$(".overlay span h3").html(msg);
		$(".overlay span button").on("click", function() {
			$(".overlay").hide();
		});

		if(closeButton) {
			$(".overlay span button").on("click", function() {
				$(".overlay").hide();
			});
			$(".overlay span button").show();
		}
		else {
			$(".overlay span button").hide();
		}

		$(".overlay").show();
	},
	hideMessage: function() {
		$(".overlay").hide();
	}
}