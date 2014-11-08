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
	stopAll: false,
	postExecutionFollowUpDelayTicketNumberCounter: 0,
	postExecutionFollowUpDelayStorage: {},
	executeBlockChain: function(startingBlock, chainCallback) {
		if(splash.Interpreter.stopAll)
			return;

		var postExecutionFollowUpDelayTicketNumber = startingBlock.codeSnippet();
		
		if(postExecutionFollowUpDelayTicketNumber != undefined) {
			splash.Interpreter.postExecutionFollowUpDelayStorage[postExecutionFollowUpDelayTicketNumber] = {};
			splash.Interpreter.postExecutionFollowUpDelayStorage[postExecutionFollowUpDelayTicketNumber].startingBlock = startingBlock;
			splash.Interpreter.postExecutionFollowUpDelayStorage[postExecutionFollowUpDelayTicketNumber].chainCallback = chainCallback;
		}
		else {
			splash.Interpreter.runPostBlockExecutionFollowUp(-1, startingBlock, chainCallback);
		}
	},
	runPostBlockExecutionFollowUp: function(ticketNumber, startingBlock, chainCallback) {
		// console.log("c", ticketNumber);
		if(ticketNumber != -1) {
			startingBlock = splash.Interpreter.postExecutionFollowUpDelayStorage[ticketNumber].startingBlock;
			chainCallback = splash.Interpreter.postExecutionFollowUpDelayStorage[ticketNumber].chainCallback;
			splash.Interpreter.postExecutionFollowUpDelayStorage[ticketNumber] = undefined;
		}

		if(startingBlock.nextBlockLink.child != undefined) {
			setTimeout(
				splash.Util.partial(splash.Interpreter.executeBlockChain, startingBlock.nextBlockLink.child, chainCallback),
				startingBlock.postExecutionDelay
			);
		}
		else if(chainCallback != undefined) {
			setTimeout(
				chainCallback,
				startingBlock.postExecutionDelay
			);
		}
		//else do nothing... end of chain with no chain-callback defined.
	},
	getPostExecutionFollowUpDelayTicketNumber: function() {
		return splash.Interpreter.postExecutionFollowUpDelayTicketNumberCounter++;
	},
	evaluateExpression: function(expression) {
		if(expression instanceof splash.OperatorBlock || expression instanceof splash.VariableBlock) {
			return expression.codeSnippet();
		}
		else {
			return parseFloat(expression);
		}
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
		block: undefined
	},

	resetCurrentDraggedBlock: function() {
		splash.DragDropController.currentDraggedBlock = {
			block: undefined
		}
	},

	drawDroppables: function() {
		_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, splash.DragDropController.drawDroppable);
	},

	drawDroppable: function(startingBlock) {
		var currentBlock = startingBlock;
		while(true) {
			if(currentBlock instanceof splash.RepeatBlock) {
				splash.DragDropController.drawRepeatDroppables(currentBlock);
			}
			else if(currentBlock instanceof splash.RepeatForeverBlock) {
				splash.DragDropController.drawRepeatDroppables(currentBlock);
				break;	
			}
			else if(currentBlock instanceof splash.IfElseBlock) {
				splash.DragDropController.drawIfElseDroppables(currentBlock);
			}

			if(currentBlock.nextBlockLink.child != undefined) {
				currentBlock = currentBlock.nextBlockLink.child;
				continue;
			}

			currentBlock.nextBlockLink.getAttachHtmlElement().append(currentBlock.nextBlockLink.htmlElement);
			break;
		}
	},

	drawRepeatDroppables: function(currentBlock) {
		if(currentBlock.repeatSubBlocksLink.child == undefined) {
			currentBlock.repeatSubBlocksLink.getAttachHtmlElement().append(currentBlock.repeatSubBlocksLink.htmlElement);
		}
		else {
			splash.DragDropController.drawDroppable(currentBlock.repeatSubBlocksLink.child);
		}
	},

	drawIfElseDroppables: function(currentBlock) {
		if(currentBlock.ifSubBlocksLink.child == undefined) {
			currentBlock.ifSubBlocksLink.getAttachHtmlElement().append(currentBlock.ifSubBlocksLink.htmlElement);
		}
		else {
			splash.DragDropController.drawDroppable(currentBlock.ifSubBlocksLink.child);
		}

		if(currentBlock.elseSubBlocksLink.child == undefined) {
			currentBlock.elseSubBlocksLink.getAttachHtmlElement().append(currentBlock.elseSubBlocksLink.htmlElement);
		}
		else {
			splash.DragDropController.drawDroppable(currentBlock.elseSubBlocksLink.child);
		}
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

		draggedBlock.htmlElement.hide();

		// Record dragged block
		splash.DragDropController.currentDraggedBlock.block = draggedBlock;

		// Draw droppables
		splash.DragDropController.drawDroppables();
	},

	cleanupAndClearDroppables: function(draggedBlock, event, ui) {
		// Note: the drop handler will fire first.

		// Check if block was dropped on a snap area (and hence has a parent)
		if(draggedBlock.parentLink == undefined) {
			$(".canvas").append(draggedBlock.htmlElement);
			draggedBlock.htmlElement.show();
			draggedBlock.htmlElement.css({
				position: "absolute",
				top: ui.offset.top - $(".canvas").offset().top,
				left: ui.offset.left - $(".canvas").offset().left
			});

			if(draggedBlock.htmlElement.position().left + draggedBlock.htmlElement.width() < 10
				|| draggedBlock.htmlElement.position().top + draggedBlock.htmlElement.find(".block-signature").height() < 10
				|| $(".canvas").width() - draggedBlock.htmlElement.position().left < 10
				|| $(".canvas").height() - draggedBlock.htmlElement.position().top < 10) { // Block is deleted
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

		dropAreaLink.getAttachHtmlElement().append(splash.DragDropController.currentDraggedBlock.block.htmlElement);
		splash.DragDropController.currentDraggedBlock.block.htmlElement.show();
		splash.DragDropController.currentDraggedBlock.block.htmlElement.css({
			position: "relative",
			top: "auto",
			left: "auto"
		});
	}
};

splash.Serializer = {
	splashObjectList: [],
	splashObjectDereferenceList: [],
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
			var value = new splash[obj.class](); // We create a default object first, so we get the reference first.
			that.splashObjectList[obj.serializeId] = value;

			splash[obj.class].prototype.deserialize.call(value, obj);
			
			return value;
		}
		else if(obj.type == "splashObjectReference") {
			if(that.splashObjectList[obj.serializeId] == undefined) {
				console.warning("Object Reference Failed!!")
				console.warning(obj);
				return;
			}
			return that.splashObjectList[obj.serializeId];
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
	isPlaying: false,
	stageDimension: {
		width: 10,
		height: 10
	},
	pixelsPerStep: 1,
	initialize: function() {
		splash.StageManager.initializeDimensions();
		splash.StageManager.initializeBackgrounds();
		splash.StageManager.initializeSprites();
		splash.StageManager.initializeButtons();
	},
	initializeDimensions: function() {
		splash.StageManager.setStageDimensions();

		$(window).on("resize", splash.StageManager.setStageDimensions);
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
			if(splash.StageManager.isPlaying) {
				splash.PageManager.showMessage("You can't play twice! Press Stop then Play again.", true);
				return;
			}

			splash.StageManager.isPlaying = true;
			splash.Interpreter.stopAll = false;
			_.forEach(splash.SpriteManager.spriteList, function(sprite) {
				splash.Interpreter.runAllStripeBlocks(sprite);
			});
		});
		$("#stopButton").on("click", function() {
			splash.Interpreter.stopAll = true;
			splash.StageManager.isPlaying = false;
			setTimeout(function() {
				splash.BackgroundManager.setCurrentBackground(0);
				splash.SpriteManager.getCurrentSprite().changeCostume(0);
				splash.SpriteManager.getCurrentSprite().setPosition("x", $(".stageOutput").width() / 2);
				splash.SpriteManager.getCurrentSprite().setPosition("y", $(".stageOutput").height() / 2);
			}, 400);
		});
	},
	setStageDimensions: function() {
		$(".stageOutput").height( $(".stageOutput").width() );

		splash.StageManager.stageDimension.width = $(".stageOutput").width();
		splash.StageManager.stageDimension.height = $(".stageOutput").height();
		splash.StageManager.pixelsPerStep = splash.StageManager.stageDimension.width/100.0;
	}
}

splash.PageManager = {
	initialize: function() {
		splash.PageManager.load();

		$("#newButton").on("click", function() {
			location.assign("/new_program/");
		});
		$("#saveButton").on("click", function() {
			splash.PageManager.showMessage("Saving...");

			var saveData = JSON.stringify(splash.Serializer.serializeInitial(splash.SpriteManager.currentSprite.firstLevelBlocks));

			try {

				$.post("save/", saveData, function(reply) {
					if(reply.success == "True") {
						splash.PageManager.showMessage("Saved!", true);
					}
					else {
						splash.PageManager.showMessage(reply.data, true);
					}
				});
			}
			catch(e) {
				splash.PageManager.showMessage("An error occured while attempting to save the program.", true);
			}
		});
		$("#makePrivateButton").on("click", function() {
			try {
				$.get("perm/PR/", {}, function(reply) {
					if(reply.success == "True") {
						splash.PageManager.showMessage("Your program has been made private!", true);
					}
					else {
						splash.PageManager.showMessage(reply.data, true);
					}
				});
			}
			catch(e) {
				splash.PageManager.showMessage("An error occured while attempting to save the program.", true);
			}
		});
		$("#makePublicButton").on("click", function() {
			try {
				$.get("perm/PU/", {}, function(reply) {
					if(reply.success == "True") {
						splash.PageManager.showMessage("Your program has been made public!", true);
					}
					else {
						splash.PageManager.showMessage(reply.data, true);
					}
				});
			}
			catch(e) {
				splash.PageManager.showMessage("An error occured while attempting to save the program.", true);
			}
		});
	},
	load: function() {
		splash.PageManager.hideMessage();
		return;
		try {
			// console.log("checkpoint1");
			$.get("load/", {}, function(reply) {
				// console.log("checkpoint2");
				if(reply.data == "") {
					// console.log("exit1");
					splash.PageManager.hideMessage();
					return;
				}
				// console.log("checkpoint3");

				// console.log(reply.data);

				var loadedObj = splash.Serializer.deserializeInitial(reply.data);
				splash.SpriteManager.currentSprite.firstLevelBlocks = loadedObj;

				// console.log("checkpoint4");
				// console.log(loadedObj);
				// console.log(splash.SpriteManager.getCurrentSprite().firstLevelBlocks);

				_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, function(block) {

					// console.log("checkpoint6");

					var htmlElement = splash.Renderer.renderBlockChain(block);
					htmlElement.css({
						top: block.positionInfo.top,
						left: block.positionInfo.left
					});
					$(".canvas").append(htmlElement);
				});

				// console.log("checkpoint5");
				splash.PageManager.hideMessage();
			});
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

splash.GalleryManager ={
	initialize: function() {
		$("#costumes").append($('<img src="/static/images/happy_turtle.png">'))
		$("#costumes").append($('<img src="/static/images/happy_turtle2.png">'))
		$("#costumes").append($('<img src="/static/images/sad_turtle.png">'))

		$("#backgrounds").append($('<img src="/static/images/background_beach.png">'))
		$("#backgrounds").append($('<img src="/static/images/background_school.png">'))
	}
}