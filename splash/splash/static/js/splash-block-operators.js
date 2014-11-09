var splash = splash || {};

splash.OperatorBlock = function OperatorBlock(parameters) {
	splash.ExpressionBlock.call(this);

	splash.Util.parseParameters(this, parameters);

	this.htmlElement = this.render();
}
splash.Util.inherits(splash.OperatorBlock, splash.ExpressionBlock);
splash.OperatorBlock.prototype.expectedArgsCount = 2;
splash.OperatorBlock.prototype.colour = "orange";
splash.OperatorBlock.prototype.render = function() {
	var that = this;

	var inputField = '<div class="block-arg-wrapper"><div class="block-arg-drop-area"></div><input class="block-arg" type="number" value="0" maxlength="3"></div>';

	var htmlElement = splash.ExpressionBlock.prototype.render.call(this)
	.addClass("block-" + that.colour)
	.append($('<div class="block-signature">'+ inputField +'<div class="block-text-outline block-text-operator">&nbsp;'+ that.name +'&nbsp;</div>'+ inputField +'</div>'));
	
	htmlElement.on("change", function() {
		var listOfArgs = $(this).find('> .block-signature > .block-arg-wrapper > .block-arg');
		for (var i = 0; i < listOfArgs.length; i++) {
			var inputField = $(listOfArgs[i]);

			if (isNaN(parseInt(inputField.val()))) {
				inputField.val(0);
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
splash.AdditionBlock.prototype.codeSnippet = function() {
	return parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) + 
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]));
};

splash.SubtractionBlock = function SubtractionBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.SubtractionBlock, splash.OperatorBlock);
splash.SubtractionBlock.prototype.name = "-";
splash.SubtractionBlock.prototype.codeSnippet = function() {
	return parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) - 
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]));
};

splash.MultiplicationBlock = function MultiplicationBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MultiplicationBlock, splash.OperatorBlock);
splash.MultiplicationBlock.prototype.name = "&#215";
splash.MultiplicationBlock.prototype.codeSnippet = function() {
	return parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) * 
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]));
};

splash.DivisionBlock = function DivisionBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.DivisionBlock, splash.OperatorBlock);
splash.DivisionBlock.prototype.name = "&#247";
splash.DivisionBlock.prototype.codeSnippet = function() {
	var value = parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) /
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]));
	if(isNaN(value))
		return 0;
	return value;
};

splash.ModuloBlock = function ModuloBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.ModuloBlock, splash.OperatorBlock);
splash.ModuloBlock.prototype.name = "%";
splash.ModuloBlock.prototype.codeSnippet = function() {
	var value = parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) % 
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]));
	if(isNaN(value))
		return 0;
	return value;
};

// Boolean Operator Blocks

splash.EqualBlock = function EqualBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.EqualBlock, splash.OperatorBlock);
splash.EqualBlock.prototype.name = "=";
splash.EqualBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) ==
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};

splash.GreaterBlock = function GreaterBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.GreaterBlock, splash.OperatorBlock);
splash.GreaterBlock.prototype.name = ">";
splash.GreaterBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) >
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};

splash.LesserBlock = function LesserBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.LesserBlock, splash.OperatorBlock);
splash.LesserBlock.prototype.name = "<";
splash.LesserBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) <
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};