var splash = splash || {};

splash.OperatorBlock = function OperatorBlock(parameters) {
	splash.ExpressionBlock.call(this);

	this.args = [];

	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.OperatorBlock, splash.ExpressionBlock);
splash.OperatorBlock.prototype.expectedArgsCount = 2;
splash.OperatorBlock.prototype.render = function() {
	var that = this;

	var inputField = '<div class="block-arg-wrapper"><div class="block-arg-drop-area"></div><input class="block-arg" type="number" value="0" maxlength="3"></div>';

	var htmlElement = splash.ExpressionBlock.prototype.render.call(this)
	.addClass("block-operator")
	.addClass("block-gold")
	.append($('<div class="block-signature">'+ inputField +'<div class="block-text-outline block-text-operator">&nbsp;'+ that.name +'&nbsp;</div>'+ inputField +'</div>'));
	
	htmlElement.children(".block-operator").on("change", function() {
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
}

// Mathematical Operator Blocks

splash.AdditionBlock = function AdditionBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.AdditionBlock, splash.OperatorBlock);
splash.AdditionBlock.prototype.name = "+";
splash.AdditionBlock.prototype.colour = "default";
splash.AdditionBlock.prototype.codeSnippet = function() {
	return splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) + 
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]);
};

splash.SubtractionBlock = function SubtractionBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SubtractionBlock, splash.OperatorBlock);
splash.SubtractionBlock.prototype.name = "-";
splash.SubtractionBlock.prototype.colour = "default";
splash.SubtractionBlock.prototype.codeSnippet = function() {
	return splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) - 
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]);
};

splash.MultiplicationBlock = function MultiplicationBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MultiplicationBlock, splash.OperatorBlock);
splash.MultiplicationBlock.prototype.name = "&#215";
splash.MultiplicationBlock.prototype.colour = "default";
splash.MultiplicationBlock.prototype.codeSnippet = function() {
	return splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) * 
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]);
};

splash.DivisionBlock = function DivisionBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.DivisionBlock, splash.OperatorBlock);
splash.DivisionBlock.prototype.name = "&#247";
splash.DivisionBlock.prototype.colour = "default";
splash.DivisionBlock.prototype.codeSnippet = function() {
	return splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) /
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]);
};

splash.ModuloBlock = function ModuloBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ModuloBlock, splash.OperatorBlock);
splash.ModuloBlock.prototype.name = "%";
splash.ModuloBlock.prototype.colour = "default";
splash.ModuloBlock.prototype.codeSnippet = function() {
	return splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) % 
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]);
};

// Boolean Operator Blocks

splash.EqualBlock = function EqualBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.EqualBlock, splash.OperatorBlock);
splash.EqualBlock.prototype.name = "=";
splash.EqualBlock.prototype.colour = "default";
splash.EqualBlock.prototype.codeSnippet = function() {
	return (splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) ==
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1])) ? 1 : 0;
};

splash.GreaterBlock = function GreaterBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.GreaterBlock, splash.OperatorBlock);
splash.GreaterBlock.prototype.name = ">";
splash.GreaterBlock.prototype.colour = "default";
splash.GreaterBlock.prototype.codeSnippet = function() {
	return (splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) >
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1])) ? 1 : 0;
};

splash.LesserBlock = function LesserBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.LesserBlock, splash.OperatorBlock);
splash.LesserBlock.prototype.name = "<";
splash.LesserBlock.prototype.colour = "default";
splash.LesserBlock.prototype.codeSnippet = function() {
	return (splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0]) <
		splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1])) ? 1 : 0;
};