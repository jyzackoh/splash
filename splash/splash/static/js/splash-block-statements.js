var splash = splash || {};

splash.StatementBlock = function StatementBlock(parameters) {
	splash.ChainableBlock.call(this);
	
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.StatementBlock, splash.ChainableBlock);
splash.StatementBlock.prototype.setNextBlockLink = function(nextBlock) {
	this.nextBlockLink.child = nextBlock;
	nextBlock.parentLink = this.nextBlockLink; // the blocklink
};
splash.StatementBlock.prototype.getNextBlockLink = function() {
	return this.nextBlockLink.child;
};
splash.StatementBlock.prototype.inputLimits = [];
splash.StatementBlock.prototype.render = function() {
	var that = this;
	var inputInjector = function() {
		var returnString = '';
		for (var i = 0; i < that.expectedArgsCount; i++) {
			returnString += '<div class="block-arg-wrapper float-right"><div class="block-arg-drop-area"></div><input class="block-arg" type="number" value="0" maxlength="3" min="'+ that.inputLimits[i].min +'" max="'+ that.inputLimits[i].max +'"></div>';
		}
    return returnString;
	};

	var htmlElement = splash.ChainableBlock.prototype.render.call(this);

	htmlElement
		.find("> .block-statement > .block-signature")
		.append($(inputInjector()));
	//var htmlElement = $('<div class="block-drag-area"><div class=" block-statement block-'+ that.colour +'"><div class="block-signature"><div class="block-name block-text-outline">' + that.name + '</div>'+ inputInjector() +'</div><div class="sub-blocks"></div></div></div>')

	htmlElement.children(".block-statement").on("change", function() {
	  var listOfArgs = $(this).find('> .block-signature > .block-arg-wrapper > .block-arg');
		for (var i = 0; i < listOfArgs.length; i++) {
			var inputField = $(listOfArgs[i]);

			if (isNaN(parseInt(inputField.val()))) {
				inputField.val(0);
			} else {
				if (inputField.val() > that.inputLimits[i].max) {
					inputField.val(that.inputLimits[i].max);
				}
				if (inputField.val() < that.inputLimits[i].min) {
					inputField.val(that.inputLimits[i].min);
				}
			}

	  	that.args[i] = inputField.val();
		}
	});

  return htmlElement;
};
splash.StatementBlock.prototype.argumentValidityCheck = function() {
	for (var i = 0; i < this.args.length; i++) {
		var argument = splash.Interpreter.evaluateExpression(this.args[i], this.expressionBlockLinks[i]);
		
		if (argument > this.inputLimits[i].max) {
			argument = (this.inputLimits[i].max);
		}
		if (argument < this.inputLimits[i].min) {
			argment = (this.inputLimits[i].min);
		}
		
		this.args[i] = argument;
	}
}

// Sub-classes should not overwrite the following functions (i.e. "final methods")
splash.StatementBlock.prototype.setNextBlockLink = function(nextBlock) {
	this.nextBlockLink.child = nextBlock;
	nextBlock.parentLink = this.nextBlockLink; // the blocklink
};
splash.StatementBlock.prototype.getNextBlockLink = function() {
	return this.nextBlockLink.child;
};
splash.StatementBlock.prototype.removeParentLink = function() {
	this.parentLink.child = undefined;
	this.parentLink = undefined;
};

//Set X Block
splash.SetXBlock = function SetXBlock(parameters) {
	this.inputLimits = [{max: 100, min:0}];
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SetXBlock, splash.StatementBlock);
splash.SetXBlock.prototype.name = "Set X to";
splash.SetXBlock.prototype.colour = "crimson";
splash.SetXBlock.prototype.expectedArgsCount = 1;
splash.SetXBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	var steps = this.args[0] * splash.StageManager.pixelsPerStep;
	splash.SpriteManager.getCurrentSprite().setPosition("x", steps);
};

//Set Y Block
splash.SetYBlock = function SetYBlock(parameters) {
	this.inputLimits = [{max: 100, min:0}];
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SetYBlock, splash.StatementBlock);
splash.SetYBlock.prototype.name = "Set Y to";
splash.SetYBlock.prototype.colour = "crimson";
splash.SetYBlock.prototype.expectedArgsCount = 1;
splash.SetYBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	var steps = this.args[0] * splash.StageManager.pixelsPerStep;
	splash.SpriteManager.getCurrentSprite().setPosition("y", steps);
};

//Show Block
splash.ShowBlock = function ShowBlock(parameters) {
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ShowBlock, splash.StatementBlock);
splash.ShowBlock.prototype.name = "Show";
splash.ShowBlock.prototype.colour = "goldenrod";
splash.ShowBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	splash.SpriteManager.getCurrentSprite().setVisibility(true);
};

//Hide Block
splash.HideBlock = function HideBlock(parameters) {
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.HideBlock, splash.StatementBlock);
splash.HideBlock.prototype.name = "Hide";
splash.HideBlock.prototype.colour = "gold";
splash.HideBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	splash.SpriteManager.getCurrentSprite().setVisibility(false);
};

//Move X Block
splash.MoveXBlock = function MoveXBlock(parameters) {
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MoveXBlock, splash.StatementBlock);
splash.MoveXBlock.prototype.name = "Step along X by";
splash.MoveXBlock.prototype.colour = "forestgreen";
splash.MoveXBlock.prototype.expectedArgsCount = 1;
splash.MoveXBlock.prototype.inputLimits = [{max:50, min:-50}];
splash.MoveXBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	var steps = this.args[0] * splash.StageManager.pixelsPerStep;
	splash.SpriteManager.getCurrentSprite().translate("x", steps);
};

//Move Y Block
splash.MoveYBlock = function MoveYBlock(parameters) {
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MoveYBlock, splash.StatementBlock);
splash.MoveYBlock.prototype.name = "Step along Y by";
splash.MoveYBlock.prototype.colour = "forestgreen";
splash.MoveYBlock.prototype.expectedArgsCount = 1;
splash.MoveYBlock.prototype.inputLimits = [{max:50, min:-50}];
splash.MoveYBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	var steps = this.args[0] * splash.StageManager.pixelsPerStep;
	splash.SpriteManager.getCurrentSprite().translate("y", steps);
};

//Wait Block
splash.WaitBlock = function WaitBlock(parameters) {
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.WaitBlock, splash.StatementBlock);
splash.WaitBlock.prototype.name = "Wait for";
splash.WaitBlock.prototype.colour = "midnightblue";
splash.WaitBlock.prototype.expectedArgsCount = 1;
splash.WaitBlock.prototype.postExecutionDelay = 0;
splash.WaitBlock.prototype.inputLimits = [{max:100, min:0}];
splash.WaitBlock.prototype.render = function() {
	var htmlElement = splash.StatementBlock.prototype.render.call(this);

	htmlElement.find("> .block-statement > .block-signature > .block-arg-wrapper > .block-arg").attr("step", "0.1");

	return htmlElement;
}
splash.WaitBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	this.postExecutionDelay = this.args[0] * 1000; // to seconds
};

//Repeat Block
splash.RepeatBlock = function RepeatBlock(parameters) {
	splash.StatementBlock.call(this);

	this.subBlocksLinks[0] = new splash.ChainableBlockLink({parent: this, attachPath: "> .block-statement > .sub-blocks"});

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.RepeatBlock, splash.StatementBlock);
splash.RepeatBlock.prototype.name = "Repeat for";
splash.RepeatBlock.prototype.colour = "dodgerblue";
splash.RepeatBlock.prototype.expectedArgsCount = 1;
splash.RepeatBlock.prototype.inputLimits = [{max:100, min:0}];
splash.RepeatBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();

	if(this.subBlocksLinks[0].child == undefined) //Nothing to repeat, continue
		return;

	var postExecutionFollowUpDelayTicketNumber = splash.Interpreter.getPostExecutionFollowUpDelayTicketNumber();

	var repeatCallbackFunction = function(repeatsLeft, thisRepeatBlock, nextBlock, ticketNumber) {
		if(repeatsLeft == 0) {
			splash.Interpreter.runPostBlockExecutionFollowUp(ticketNumber);
			return;
		}

		repeatsLeft--;

		splash.Interpreter.executeBlockChain(
			thisRepeatBlock.subBlocksLinks[0].child, 
			_.partial(repeatCallbackFunction, repeatsLeft, thisRepeatBlock, nextBlock, ticketNumber)
		);
	};

	splash.Interpreter.executeBlockChain(
		this.subBlocksLinks[0].child,
		_.partial(repeatCallbackFunction, parseInt(this.args[0]), this, this.nextBlockLink.child, postExecutionFollowUpDelayTicketNumber)
	);

	return postExecutionFollowUpDelayTicketNumber;
};

//Repeat-Forever Block
splash.RepeatForeverBlock = function RepeatForeverBlock(parameters) {
	splash.StatementBlock.call(this);

	this.subBlocksLinks[0] = new splash.ChainableBlockLink({parent: this, attachPath: "> .block-statement > .sub-blocks"});

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.RepeatForeverBlock, splash.StatementBlock);
splash.RepeatForeverBlock.prototype.name = "Repeat Forever";
splash.RepeatForeverBlock.prototype.colour = "pureblue";
splash.RepeatForeverBlock.prototype.expectedArgsCount = 0;
splash.RepeatForeverBlock.prototype.allowChildrenBlocks = false;
splash.RepeatForeverBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	if(this.subBlocksLinks[0].child == undefined) //Nothing to repeat, continue
		return;

	var postExecutionFollowUpDelayTicketNumber = splash.Interpreter.getPostExecutionFollowUpDelayTicketNumber(); // We get a ticket anyway, although we don't use it, to tell the Interpreter that you don't need

	var repeatCallbackFunction = function(thisRepeatBlock) {
		splash.Interpreter.executeBlockChain(
			thisRepeatBlock.subBlocksLinks[0].child, 
			_.partial(repeatCallbackFunction, thisRepeatBlock)
		);
	};

	splash.Interpreter.executeBlockChain(
		this.subBlocksLinks[0].child,
		_.partial(repeatCallbackFunction, this)
	);

	return postExecutionFollowUpDelayTicketNumber;
};


//Repeat Block
splash.WhileBlock = function WhileBlock(parameters) {
	splash.StatementBlock.call(this);

	this.subBlocksLinks[0] = new splash.ChainableBlockLink({parent: this, attachPath: "> .block-statement > .sub-blocks"});

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.WhileBlock, splash.StatementBlock);
splash.WhileBlock.prototype.name = "While";
splash.WhileBlock.prototype.colour = "purpleblue";
splash.WhileBlock.prototype.expectedArgsCount = 1;
splash.WhileBlock.prototype.inputLimits = [{max:1, min:0}];
splash.WhileBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();

	if(this.subBlocksLinks[0].child == undefined) //Nothing to repeat, continue
		return;

	var postExecutionFollowUpDelayTicketNumber = splash.Interpreter.getPostExecutionFollowUpDelayTicketNumber();

	var repeatCallbackFunction = function(thisWhileBlock, nextBlock, ticketNumber) {
		if(!splash.Interpreter.evaluateExpression(thisWhileBlock.args[0], thisWhileBlock.expressionBlockLinks[0])) {
			splash.Interpreter.runPostBlockExecutionFollowUp(ticketNumber);
			return;
		}

		splash.Interpreter.executeBlockChain(
			thisWhileBlock.subBlocksLinks[0].child, 
			_.partial(repeatCallbackFunction, thisWhileBlock, nextBlock, ticketNumber)
		);
	};

	if(!splash.Interpreter.evaluateExpression(thisWhileBlock.args[0], thisWhileBlock.expressionBlockLinks[0]) {
		splash.Interpreter.executeBlockChain(
			this.subBlocksLinks[0].child,
			_.partial(repeatCallbackFunction, this, this.nextBlockLink.child, postExecutionFollowUpDelayTicketNumber)
		);
	}

	return postExecutionFollowUpDelayTicketNumber;
};

//Change Costume Block
splash.ChangeCostumeBlock = function ChangeCostumeBlock(parameters) {
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ChangeCostumeBlock, splash.StatementBlock);
splash.ChangeCostumeBlock.prototype.name = "Change costume to";
splash.ChangeCostumeBlock.prototype.colour = "indigo";
splash.ChangeCostumeBlock.prototype.expectedArgsCount = 1;
splash.ChangeCostumeBlock.prototype.inputLimits = [{max:2, min:0}];
splash.ChangeCostumeBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	splash.SpriteManager.getCurrentSprite().changeCostume(this.args[0]);
};

//Change Background Block
splash.ChangeBackgroundBlock = function ChangeBackgroundBlock(parameters) {
	splash.StatementBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ChangeBackgroundBlock, splash.StatementBlock);
splash.ChangeBackgroundBlock.prototype.name = "Change background to";
splash.ChangeBackgroundBlock.prototype.colour = "plum";
splash.ChangeBackgroundBlock.prototype.expectedArgsCount = 1;
splash.StatementBlock.prototype.inputLimits = [{max:1, min:0}];
splash.ChangeBackgroundBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();
	splash.BackgroundManager.setCurrentBackground(this.args[0]);
};

//If-Else Block
splash.IfElseBlock = function IfElseBlock(parameters) {
	this.inputLimits = [{max: 1, min: 0}];
	splash.StatementBlock.call(this);

	this.subBlocksLinks[0] = new splash.ChainableBlockLink({parent: this, attachPath: "> .block-statement > .if-sub-blocks"});
	this.subBlocksLinks[1] = new splash.ChainableBlockLink({parent: this, attachPath: "> .block-statement > .else-sub-blocks"});

	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.IfElseBlock, splash.StatementBlock);
splash.IfElseBlock.prototype.name = "If";
splash.IfElseBlock.prototype.colour = "maroon";
splash.IfElseBlock.prototype.expectedArgsCount = 1;
splash.IfElseBlock.prototype.codeSnippet = function() {
	this.argumentValidityCheck();

	if(parseFloat(this.args[0])) {
		var innerBlockChainToExecute = this.subBlocksLinks[0].child;
	}
	else {
		var innerBlockChainToExecute = this.subBlocksLinks[1].child;
	}

	if(innerBlockChainToExecute == undefined) //Nothing in sub-block, continue
		return;

	var postExecutionFollowUpDelayTicketNumber = splash.Interpreter.getPostExecutionFollowUpDelayTicketNumber();

	var ifElseCallbackFunction = function(ticketNumber) {
		splash.Interpreter.runPostBlockExecutionFollowUp(ticketNumber);
	};

	splash.Interpreter.executeBlockChain(
		innerBlockChainToExecute,
		_.partial(ifElseCallbackFunction, postExecutionFollowUpDelayTicketNumber)
	);

	return postExecutionFollowUpDelayTicketNumber;
};
splash.IfElseBlock.prototype.render = function() {
	var htmlElement = splash.StatementBlock.prototype.render.call(this);

	htmlElement.find("> .block-statement > .sub-blocks").remove();

	htmlElement.find("> .block-statement").append(
		$('<div class="if-sub-blocks"></div>')
	);

	htmlElement.find("> .block-statement").append(
		$('</div><div class="block-signature"><div class="block-name block-text-outline">Else</div></div>')
	);

	htmlElement.find("> .block-statement").append(
		$('<div class="else-sub-blocks"></div>')
	);

	return htmlElement;
}