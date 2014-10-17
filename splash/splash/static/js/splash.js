function splash() {
	function Block() {
		var label = 'Some Block';
		var expectedArgsNum = 1; //one extra arg?
		var delay = 0;
	}
	Block.prototype.codeSnippet = function() {};
	Block.prototype.render = function() {};
	Block.prototype.onSnap = function() {};
	Block.prototype.serialize = function() {};

	//Copy and paste for setYBlock
	function setXBlock(character, newX) {
		this.label = "Set X";
		this.color = "red"; //replace with some Hexadecimal code?
		this.character = character;
		this.expectedArgsNum = 2;
		this.nextBlock = null;
		this.args = []; //Is there a need to use this? or just use newX str away?

		args.push(newX);
	}
	setXBlock.prototype = new Block();
	setXBlock.prototype.codeSnippet = function() {};
	setXBlock.prototype.render = function() {};
	setXBlock.prototype.onSnap = function() {}; //Code to put next as the dropped block
	setXBlock.prototype.serialize = function() {};


	//Copy and paste for Hide
	function showBlock(character) {
		this.label = "Show";
		this.color = "green"; //replace with some Hexadecimal code?
		this.character = character;
		this.nextBlock = null;
		this.expectedArgsNum = 1;
	}
	showBlock.prototype = new Block();
	showBlock.prototype.codeSnippet = function() {};
	showBlock.prototype.render = function() {};
	showBlock.prototype.onSnap = function() {}; //Code to put next as the dropped block
	showBlock.prototype.serialize = function() {};


	function moveBlock(character, moveX, moveY) {
		this.label = "Move";
		this.color = "blue"; //replace with some Hexadecimal code?
		this.character = character;
		this.expectedArgsNum = 3;
		this.nextBlock = null;
		this.args = []; //Is there a need to use this? or just use newX str away?

		args.push(moveX);
		args.push(moveY);
	}
	moveBlock.prototype = new Block();
	moveBlock.prototype.codeSnippet = function() {};
	moveBlock.prototype.render = function() {};
	moveBlock.prototype.onSnap = function() {}; //Code to put next as the dropped block
	moveBlock.prototype.serialize = function() {};


	function waitBlock(delay) {
		this.label = "Wait";
		this.color = "yellow"; //replace with some Hexadecimal code?
		this.delay = delay;
		this.expectedArgsNum = 1;
		this.nextBlock = null;
	}
	waitBlock.prototype = new Block();
	waitBlock.prototype.codeSnippet = function() {};
	waitBlock.prototype.render = function() {};
	waitBlock.prototype.onSnap = function() {}; //Code to put next as the dropped block
	waitBlock.prototype.serialize = function() {};


	function changeCostumeBlock(character, costume) {
		this.label = "Change Costume";
		this.color = "gray"; //replace with some Hexadecimal code?
		this.character = character;
		this.expectedArgsNum = 2;
		this.nextBlock = null;
		this.args = []; //Is there a need to use this? or just use newX str away?

		args.push(costume);
	}
	changeCostumeBlock.prototype = new Block();
	changeCostumeBlock.prototype.codeSnippet = function() {};
	changeCostumeBlock.prototype.render = function() {};
	changeCostumeBlock.prototype.onSnap = function() {}; //Code to put next as the dropped block
	changeCostumeBlock.prototype.serialize = function() {};


	function changeBackgroundBlock(background) {
		this.label = "Change Background";
		this.color = "black"; //replace with some Hexadecimal code?
		this.expectedArgsNum = 1;
		this.nextBlock = null;
	}
	changeBackgroundBlock.prototype = new Block();
	changeBackgroundBlock.prototype.codeSnippet = function() {};
	changeBackgroundBlock.prototype.render = function() {};
	changeBackgroundBlock.prototype.onSnap = function() {}; //Code to put next as the dropped block
	changeBackgroundBlock.prototype.serialize = function() {};
}