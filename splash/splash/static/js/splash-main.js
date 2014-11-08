var splash = splash || {};

splash.Main = {
	initializeComponents: function() {
		splash.StageManager.initialize();
		splash.GalleryManager.initialize();
		splash.PageManager.initialize();
		splash.Main.initializeTemplates();
	},
	initializeTemplates: function() {
		var MOVEMENT = "#movementPal";
		var CONTROL = "#controlPal";
		var APPEARANCE = "#appearancePal";
		var OPERATOR = "#operatorPal";
		var VARIABLE = "#variablePal";
		function setTemplateBlock(category, block) {
			block.htmlElement.draggable({
				helper: "clone",
				start: _.partial(splash.DragDropController.setupTemplateCloneAndDrawDroppables, block.constructor.name),
				stop: splash.DragDropController.cleanupTemplateCloneAndClearDroppables,
				zIndex: 1000,
				refreshPositions: true,
				appendTo: "body"
			});
			block.htmlElement.addClass("template-block");
			$(category + " .panel-body")
				.append(block.htmlElement)

			if(block instanceof splash.ExpressionBlock)
				$(category + " .panel-body")
					.append("<br>");
		}
		setTemplateBlock(MOVEMENT, new splash.SetXBlock());
		setTemplateBlock(MOVEMENT, new splash.SetYBlock());
		setTemplateBlock(MOVEMENT, new splash.MoveXBlock());
		setTemplateBlock(MOVEMENT, new splash.MoveYBlock());

		setTemplateBlock(APPEARANCE, new splash.ShowBlock());
		setTemplateBlock(APPEARANCE, new splash.HideBlock());
		setTemplateBlock(APPEARANCE, new splash.ChangeBackgroundBlock());
		setTemplateBlock(APPEARANCE, new splash.ChangeCostumeBlock());
		
		setTemplateBlock(CONTROL, new splash.RepeatBlock());
		setTemplateBlock(CONTROL, new splash.RepeatForeverBlock());
		setTemplateBlock(CONTROL, new splash.IfElseBlock());
		setTemplateBlock(CONTROL, new splash.WaitBlock());

		setTemplateBlock(OPERATOR, new splash.AdditionBlock());
		setTemplateBlock(OPERATOR, new splash.SubtractionBlock());
		setTemplateBlock(OPERATOR, new splash.MultiplicationBlock());
		setTemplateBlock(OPERATOR, new splash.DivisionBlock());
		setTemplateBlock(OPERATOR, new splash.ModuloBlock());
		setTemplateBlock(OPERATOR, new splash.EqualBlock());
		setTemplateBlock(OPERATOR, new splash.GreaterBlock());
		setTemplateBlock(OPERATOR, new splash.LesserBlock());

		setTemplateBlock(VARIABLE, new splash.SpriteXPositionBlock());
		setTemplateBlock(VARIABLE, new splash.SpriteYPositionBlock());
		setTemplateBlock(VARIABLE, new splash.StageTopBlock());
		setTemplateBlock(VARIABLE, new splash.StageBottomBlock());
		setTemplateBlock(VARIABLE, new splash.StageLeftBlock());
		setTemplateBlock(VARIABLE, new splash.StageRightBlock());
	}
}

$(function() {
	splash.Main.initializeComponents();
	// var abc1 = new splash.SetXBlock({
	// 	name: "abc1",
	// 	codeSnippet: function() {
	// 		console.log("hi1");
	// 	}
	// });
	// var abc2 = new splash.SetYBlock({
	// 	name: "abc2",
	// 	codeSnippet: function() {
	// 		console.log("hi2");
	// 	}
	// });
	// var abc3 = new splash.ShowBlock({
	//     name: "abc3",
	//     codeSnippet: function() {
	//         console.log("hi3");
	//     }
	// });
	// var abc4 = new splash.RepeatBlock({
	//     name: "abc4",
	//     codeSnippet: function() {
	//         console.log("hi4");
	//     }
	// });

	// abc1.setNextBlockLink(abc2);
	// abc2.setNextBlockLink(abc3);

	// newSprite.addFirstLevelBlock(abc1);
	// newSprite.addFirstLevelBlock(abc4);

	// $(".canvas").append(splash.Renderer.renderBlockChain(abc1));
	// $(".canvas").append(splash.Renderer.renderBlockChain(abc4));

	//abc4.repeatSubBlocksLink.child = abc3;












	// var pppl = JSON.stringify(splash.Serializer.serializeInitial(splash.SpriteManager.spriteList));
	// console.log(pppl);
	// console.log("TEST 2 START");
	// console.log(splash.Serializer.deserializeInitial(JSON.parse(pppl)));
	// console.log("TEST 2 END");

	
});