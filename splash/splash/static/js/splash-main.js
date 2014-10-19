$(function() {
	var newSprite = new splash.Sprite();
	splash.SpriteManager.addSprite(newSprite);

	splash.SpriteManager.setCurrentSprite(newSprite);
	var abc1 = new splash.SetXBlock({
		name: "abc1",
		codeSnippet: function() {
			console.log("hi1");
		}
	});
	var abc2 = new splash.SetYBlock({
		name: "abc2",
		codeSnippet: function() {
			console.log("hi2");
		}
	});
	var abc3 = new splash.ShowBlock({
	    name: "abc3",
	    codeSnippet: function() {
	        console.log("hi3");
	    }
	});
	var abc4 = new splash.HideBlock({
	    name: "abc4",
	    codeSnippet: function() {
	        console.log("hi4");
	    }
	});

	abc1.setNextBlockLink(abc2);
	abc2.setNextBlockLink(abc3);

	newSprite.addFirstLevelBlock(abc1);
	newSprite.addFirstLevelBlock(abc4);

	$(".canvas").append(splash.Renderer.renderBlockChain(abc1));
	$(".canvas").append(splash.Renderer.renderBlockChain(abc4));


	var MOVEMENT = "#movementPal";
	var VISIBILITY = "#visibilityPal";
	var APPEARANCE = "#appearancePal";
	var LOOP_AND_WAIT = "#loopPal";
	function setTemplateBlock(category, block) {
		block.htmlElement.draggable({
			helper: "clone",
			start: splash.DragDropController.setupTemplateCloneAndDrawDroppables,
			stop: splash.DragDropController.cleanupTemplateCloneAndClearDroppables
		});
		block.htmlElement.appendTo($(category + " .panel-body"));
	}
	setTemplateBlock(MOVEMENT, new splash.SetXBlock());
	setTemplateBlock(MOVEMENT, new splash.SetYBlock());
	setTemplateBlock(MOVEMENT, new splash.MoveXBlock());
	setTemplateBlock(MOVEMENT, new splash.MoveYBlock());

	setTemplateBlock(VISIBILITY, new splash.ShowBlock());
	setTemplateBlock(VISIBILITY, new splash.HideBlock());
	
	setTemplateBlock(APPEARANCE, new splash.ChangeBackgroundBlock());
	setTemplateBlock(APPEARANCE, new splash.ChangeCostumeBlock());
	
	setTemplateBlock(LOOP_AND_WAIT, new splash.RepeatBlock());
	setTemplateBlock(LOOP_AND_WAIT, new splash.WaitBlock());
});