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

	// var abc1 = new splash.Block({});
	// var abc2 = new splash.SetXBlock({});
	// var abc3 = new splash.SetYBlock({});
	// var abc4 = new splash.ShowBlock({});
	// var abc5 = new splash.HideBlock({});
	// var abc6 = new splash.WaitBlock({});
	// var abc7 = new splash.MoveXBlock({});
	// var abc8 = new splash.MoveYBlock({});
	// var abc9 = new splash.RepeatBlock({});
	// var abc10 = new splash.ChangeCostumeBlock({});
	// var abc11 = new splash.ChangeBackgroundBlock({});

	// abc1.setNextBlockLink(abc2);
	// abc2.setNextBlockLink(abc3);
	// abc3.setNextBlockLink(abc4);
	// abc4.setNextBlockLink(abc5);
	// abc5.setNextBlockLink(abc6);
	// abc6.setNextBlockLink(abc7);
	// abc7.setNextBlockLink(abc8);
	// abc8.setNextBlockLink(abc9);
	// abc9.setNextBlockLink(abc10);
	// abc10.setNextBlockLink(abc11);
});