var splash = splash || {};

splash.DragDropController = {
	currentDraggedBlock: {
		block: undefined
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
		_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, splash.DragDropController.drawDroppable);
	},

	drawDroppable: function(startingBlock) {
		var currentBlock = startingBlock;

		if(currentBlock instanceof splash.ExpressionBlock)
			return;

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

		// Clear droppables
		$(".chain-snap-area").detach();
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
	},

	setupTemplateCloneAndDrawDroppables: function(blockName, event, ui) {
		// Record dragged block
		splash.DragDropController.currentDraggedBlock.block = new splash[blockName]();

		// Draw droppables
		_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, splash.DragDropController.drawDroppable);
	},

	cleanupTemplateCloneAndClearDroppables: function(event, ui) {
		ui.helper.remove();
		splash.DragDropController.cleanupAndClearDroppables(splash.DragDropController.currentDraggedBlock.block, event, ui);
	},

	// ============================ Expression Blocks =======================================

	unchainAndDrawExpressionDroppables: function(draggedBlock) {
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
		_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, splash.DragDropController.drawExpressionDroppable);
	},

	drawExpressionDroppable: function(startingBlock) {
		var currentBlock = startingBlock;

		function drawTheDroppablesWithinBlock(thisBlock) {
			var pathToWrapper = (((thisBlock instanceof splash.ExpressionBlock) ? "" : "> .block-statement") + "> .block-signature > .block-arg-wrapper");
			for(var i = 0; i < thisBlock.expectedArgsCount; i++) {
				if(thisBlock.expressionBlockLinks[i].child == undefined) {
					var argWrapper = $(thisBlock.htmlElement.find(pathToWrapper)[i]);

					argWrapper
						.children(".block-arg-drop-area")
						.append(thisBlock.expressionBlockLinks[i].htmlElement)
						.show();

					argWrapper
						.children(".block-arg")
						.hide();
				}
				else {
					splash.DragDropController.drawExpressionDroppable(thisBlock.expressionBlockLinks[i].child);
				}
			}
		}

		if(currentBlock instanceof splash.ExpressionBlock) {
			drawTheDroppablesWithinBlock(currentBlock);
			return;
		}

		while(true) {
			if(currentBlock instanceof splash.RepeatBlock || currentBlock instanceof splash.RepeatForeverBlock) {
				if(currentBlock.repeatSubBlocksLink.child != undefined) {
					splash.DragDropController.drawExpressionDroppable(currentBlock.repeatSubBlocksLink.child);
				}
			}
			else if(currentBlock instanceof splash.IfElseBlock) {
				if(currentBlock.ifSubBlocksLink.child != undefined) {
					splash.DragDropController.drawExpressionDroppable(currentBlock.ifSubBlocksLink.child);
				}
				if(currentBlock.elseSubBlocksLink.child != undefined) {
					splash.DragDropController.drawExpressionDroppable(currentBlock.elseSubBlocksLink.child);
				}
			}

			drawTheDroppablesWithinBlock(currentBlock);

			if(currentBlock.nextBlockLink.child != undefined) {
				currentBlock = currentBlock.nextBlockLink.child;
			}
			else {
				break;
			}
		}
	},

	cleanupAndClearExpressionDroppables: function(draggedBlock, event, ui) {
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

		// Clear droppables
		$(".expression-snap-area").detach();

		var wrappers = $(".canvas").find(".block-arg-wrapper");
		_.forEach(wrappers, function(i) {
			if($(i).children(".block-arg-drop-area").html() == "") {
				$(i).children(".block-arg-drop-area").hide();
				$(i).children(".block-arg").show();
			}
		});
	},

	expressionSnapAreaDropHandler: function(dropAreaLink) {
		// Check if block was dropped on a snap area (and hence has a parent)... Prevent multiple-attachements
		if(splash.DragDropController.currentDraggedBlock.block.parentLink != undefined) {
			return;
		}

		dropAreaLink.child = splash.DragDropController.currentDraggedBlock.block;
		splash.DragDropController.currentDraggedBlock.block.parentLink = dropAreaLink;

		var thisBlock = dropAreaLink.parent;
		var pathToWrapper = (((thisBlock instanceof splash.ExpressionBlock) ? "" : "> .block-statement") + "> .block-signature > .block-arg-wrapper");

		for(var i = 0; i < thisBlock.expectedArgsCount; i++) {
			if(thisBlock.expressionBlockLinks[i] == dropAreaLink) {
				var argWrapper = $(thisBlock.htmlElement.find(pathToWrapper)[i]);

				argWrapper
					.children(".block-arg-drop-area")
					.append(splash.DragDropController.currentDraggedBlock.block.htmlElement);
			}
		}

		splash.DragDropController.currentDraggedBlock.block.htmlElement.show();
		splash.DragDropController.currentDraggedBlock.block.htmlElement.css({
			position: "relative",
			top: "auto",
			left: "auto"
		});
	},

	setupExpressionTemplateCloneAndDrawDroppables: function(blockName, event, ui) {
		// Record dragged block
		splash.DragDropController.currentDraggedBlock.block = new splash[blockName]();

		// Draw droppables
		_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, splash.DragDropController.drawExpressionDroppable);
	},

	cleanupExpressionTemplateCloneAndClearDroppables: function(event, ui) {
		ui.helper.remove();
		splash.DragDropController.cleanupAndClearExpressionDroppables(splash.DragDropController.currentDraggedBlock.block, event, ui);
	},
};