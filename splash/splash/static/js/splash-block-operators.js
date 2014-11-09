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
splash.OperatorBlock.prototype.serialize = function(splashObjectId) {
	var returnObject = splash.ExpressionBlock.prototype.serialize.call(this, splashObjectId);

	returnObject.blockArgValues = [];

	for (var i = 0; i < this.expectedArgsCount; i++) {
		returnObject.blockArgValues.push(
			this.htmlElement.find('> .block-signature > .block-arg-wrapper > .block-arg').eq(i).val()
		);
	}

	return returnObject;
};

splash.OperatorBlock.prototype.deserialize = function(obj) {
	splash.ExpressionBlock.prototype.deserialize.call(this, obj);

	for (var i = 0; i < this.expectedArgsCount; i++) {
		this.htmlElement.find('> .block-signature > .block-arg-wrapper > .block-arg').eq(i).val(obj.blockArgValues[i]);
	}
};

// Mathematical Operator Blocks

splash.AdditionBlock = function AdditionBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.AdditionBlock, splash.OperatorBlock);
splash.AdditionBlock.prototype.name = "+";
splash.AdditionBlock.prototype.colour = "tangerine";
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
splash.SubtractionBlock.prototype.colour = "tangerine";
splash.SubtractionBlock.prototype.codeSnippet = function() {
	return parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) - 
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]));
};

splash.MultiplicationBlock = function MultiplicationBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.MultiplicationBlock, splash.OperatorBlock);
splash.MultiplicationBlock.prototype.name = "&#215;";
splash.MultiplicationBlock.prototype.colour = "tangerine";
splash.MultiplicationBlock.prototype.codeSnippet = function() {
	return parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) * 
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]));
};

splash.DivisionBlock = function DivisionBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.DivisionBlock, splash.OperatorBlock);
splash.DivisionBlock.prototype.name = "&#247;";
splash.DivisionBlock.prototype.colour = "tangerine";
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
splash.ModuloBlock.prototype.colour = "tangerine";
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

splash.NotEqualBlock = function NotEqualBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.NotEqualBlock, splash.OperatorBlock);
splash.NotEqualBlock.prototype.name = "&ne;";
splash.NotEqualBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) !=
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};

splash.GreaterBlock = function GreaterBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.GreaterBlock, splash.OperatorBlock);
splash.GreaterBlock.prototype.name = "&gt;";
splash.GreaterBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) >
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};

splash.LesserBlock = function LesserBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.LesserBlock, splash.OperatorBlock);
splash.LesserBlock.prototype.name = "&lt;";
splash.LesserBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) <
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};

splash.GreaterEqualBlock = function GreaterEqualBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.GreaterEqualBlock, splash.OperatorBlock);
splash.GreaterEqualBlock.prototype.name = "&ge;";
splash.GreaterEqualBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) >=
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};

splash.LesserEqualBlock = function LesserEqualBlock(parameters){
	splash.OperatorBlock.call(this);
	splash.Util.parseParameters(this, parameters);
}
splash.Util.inherits(splash.LesserEqualBlock, splash.OperatorBlock);
splash.LesserEqualBlock.prototype.name = "&le;";
splash.LesserEqualBlock.prototype.codeSnippet = function() {
	return (parseFloat(splash.Interpreter.evaluateExpression(this.args[0], this.expressionBlockLinks[0])) <=
		parseFloat(splash.Interpreter.evaluateExpression(this.args[1], this.expressionBlockLinks[1]))) ? 1 : 0;
};