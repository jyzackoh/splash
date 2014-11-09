var splash = splash || {};

splash.TemplateManager = {
	initialize: function() {
		var MOVEMENT = "#movementPal";
		var APPEARANCE = "#appearancePal";
		var CONTROL = "#controlPal";
		var EVENT = "#eventPal";
		var OPERATOR = "#operatorPal";
		var BOOLEAN = "#booleanPal"
		var VARIABLE = "#variablePal";
		function setTemplateBlock(category, block) {
			if(block instanceof splash.ExpressionBlock) {
				block.htmlElement.draggable({
					start: _.partial(splash.DragDropController.setupExpressionTemplateCloneAndDrawDroppables, block.constructor.name),
					stop: splash.DragDropController.cleanupExpressionTemplateCloneAndClearDroppables,
					zIndex: 1000,
					refreshPositions: true,
					helper: "clone",
					appendTo: "body"
				});

				block.htmlElement.tooltip("destroy");

				block.htmlElement.addClass("template-block");

				$(category + " .panel-body")
					.append(block.htmlElement)
					.append("<br>");
			}
			else {
				block.htmlElement.draggable({
					start: _.partial(splash.DragDropController.setupTemplateCloneAndDrawDroppables, block.constructor.name),
					stop: splash.DragDropController.cleanupTemplateCloneAndClearDroppables,
					zIndex: 1000,
					refreshPositions: true,
					helper: "clone",
					appendTo: "body"
				});

				block.htmlElement.addClass("template-block");

				$(category + " .panel-body")
					.append(block.htmlElement)
			}
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
		setTemplateBlock(CONTROL, new splash.WhileBlock());
		setTemplateBlock(CONTROL, new splash.RepeatForeverBlock());
		setTemplateBlock(CONTROL, new splash.IfElseBlock());
		setTemplateBlock(CONTROL, new splash.WaitBlock());

		setTemplateBlock(EVENT, new splash.OnSpaceBlock());

		setTemplateBlock(OPERATOR, new splash.AdditionBlock());
		setTemplateBlock(OPERATOR, new splash.SubtractionBlock());
		setTemplateBlock(OPERATOR, new splash.MultiplicationBlock());
		setTemplateBlock(OPERATOR, new splash.DivisionBlock());
		setTemplateBlock(OPERATOR, new splash.ModuloBlock());
		
		setTemplateBlock(BOOLEAN, new splash.EqualBlock());
		setTemplateBlock(BOOLEAN, new splash.NotEqualBlock());
		setTemplateBlock(BOOLEAN, new splash.GreaterBlock());
		setTemplateBlock(BOOLEAN, new splash.LesserBlock());
		setTemplateBlock(BOOLEAN, new splash.GreaterEqualBlock());
		setTemplateBlock(BOOLEAN, new splash.LesserEqualBlock());

		setTemplateBlock(VARIABLE, new splash.SpriteXPositionBlock());
		setTemplateBlock(VARIABLE, new splash.SpriteYPositionBlock());
		setTemplateBlock(VARIABLE, new splash.StageTopBlock());
		setTemplateBlock(VARIABLE, new splash.StageBottomBlock());
		setTemplateBlock(VARIABLE, new splash.StageLeftBlock());
		setTemplateBlock(VARIABLE, new splash.StageRightBlock());
	}
}

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
};

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

			$(".canvas").find("input").attr("disabled", true);
			$(".draggable-element").draggable("disable");

			splash.StageManager.isPlaying = true;
			_.forEach(splash.SpriteManager.spriteList, function(sprite) {
				splash.Interpreter.runAllStripeBlocks(sprite);
			});
		});
		$("#stopButton").on("click", function() {
			splash.StageManager.isPlaying = false;

			var id = window.setTimeout(function() {}, 0);
			while (id--) {
				clearTimeout(id);
			}

			$("body").off(".splashEvents");

			splash.BackgroundManager.setCurrentBackground(0);
			splash.SpriteManager.getCurrentSprite().changeCostume(0);
			splash.SpriteManager.getCurrentSprite().setPosition("x", $(".stageOutput").width() / 2);
			splash.SpriteManager.getCurrentSprite().setPosition("y", $(".stageOutput").height() / 2);

			$(".canvas").find("input").attr("disabled", false);
			$(".draggable-element").draggable("enable");
		});
	},
	setStageDimensions: function() {
		$(".stageOutput").height( $(".stageOutput").width() );
		$(".stage").height( $(".stageOutput").height()+38);
		var calcedMargin = ($(".stage").width() - $(".stageOutput").width())/2
		if (calcedMargin > 1) {
			$(".stageOutput").css({"margin-left":calcedMargin});
		}

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
		// splash.PageManager.hideMessage();
		// return;
		try {
			$.get("load/", {}, function(reply) {
				if(reply.data == "") {
					splash.PageManager.hideMessage();
					return;
				}

				var loadedObj = splash.Serializer.deserializeInitial(reply.data);
				splash.SpriteManager.currentSprite.firstLevelBlocks = loadedObj;

				_.forEach(splash.SpriteManager.currentSprite.firstLevelBlocks, function(block) {
					var htmlElement = splash.Renderer.renderBlock(block);
					htmlElement.css({
						top: block.positionInfo.top,
						left: block.positionInfo.left
					});
					$(".canvas").append(htmlElement);
				});

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

splash.GalleryManager = {
	initialize: function() {
		$("#costumes").append($('<img src="/static/images/happy_turtle.png">'))
		$("#costumes").append($('<img src="/static/images/happy_turtle2.png">'))
		$("#costumes").append($('<img src="/static/images/sad_turtle.png">'))

		$("#backgrounds").append($('<img src="/static/images/background_beach.png">'))
		$("#backgrounds").append($('<img src="/static/images/background_school.png">'))
	}
}