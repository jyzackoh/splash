var splash = splash || {};

splash.Interpreter = {
	stopAll: false,
	postExecutionFollowUpDelayTicketNumberCounter: 0,
	postExecutionFollowUpDelayStorage: {},
	executeBlockChain: function(startingBlock, chainCallback) {
		if(splash.Interpreter.stopAll)
			return;

		var postExecutionFollowUpDelayTicketNumber = startingBlock.codeSnippet();
		
		if(postExecutionFollowUpDelayTicketNumber != undefined) {
			splash.Interpreter.postExecutionFollowUpDelayStorage[postExecutionFollowUpDelayTicketNumber] = {};
			splash.Interpreter.postExecutionFollowUpDelayStorage[postExecutionFollowUpDelayTicketNumber].startingBlock = startingBlock;
			splash.Interpreter.postExecutionFollowUpDelayStorage[postExecutionFollowUpDelayTicketNumber].chainCallback = chainCallback;
		}
		else {
			splash.Interpreter.runPostBlockExecutionFollowUp(-1, startingBlock, chainCallback);
		}
	},
	runPostBlockExecutionFollowUp: function(ticketNumber, startingBlock, chainCallback) {
		if(ticketNumber != -1) {
			startingBlock = splash.Interpreter.postExecutionFollowUpDelayStorage[ticketNumber].startingBlock;
			chainCallback = splash.Interpreter.postExecutionFollowUpDelayStorage[ticketNumber].chainCallback;
			splash.Interpreter.postExecutionFollowUpDelayStorage[ticketNumber] = undefined;
		}

		if(startingBlock.nextBlockLink.child != undefined) {
			setTimeout(
				splash.Util.partial(splash.Interpreter.executeBlockChain, startingBlock.nextBlockLink.child, chainCallback),
				startingBlock.postExecutionDelay
			);
		}
		else if(chainCallback != undefined) {
			setTimeout(
				chainCallback,
				startingBlock.postExecutionDelay
			);
		}
		//else do nothing... end of chain with no chain-callback defined.
	},
	getPostExecutionFollowUpDelayTicketNumber: function() {
		return splash.Interpreter.postExecutionFollowUpDelayTicketNumberCounter++;
	},
	evaluateExpression: function(value, blockLink) {
		console.log(value, blockLink);

		if(blockLink.child != undefined) {
			// We use the block
			var expression = blockLink.child;
		}
		else {
			var expression = value;
		}

		if(expression instanceof splash.ExpressionBlock) {
			return expression.codeSnippet();
		}
		else {
			return expression;
		}
	},
	runAllStripeBlocks: function(stripe) {
		_.forEach(stripe.firstLevelBlocks, function(startingBlock) {
			if(startingBlock instanceof splash.StatementBlock)
				splash.Interpreter.executeBlockChain(startingBlock);
		});
	}
};

splash.Renderer = {
	renderBlockChain: function(startingBlock) {

		var currentBlock = startingBlock;

		while(true) {
			if(currentBlock.nextBlockLink.child == undefined) {
                break;
			}
			else {
				currentBlock.htmlElement.append(currentBlock.nextBlockLink.child.htmlElement);
				currentBlock.nextBlockLink.child.htmlElement.css({
					position: "relative"
				});

				currentBlock = currentBlock.nextBlockLink.child;
			}			
		}

		startingBlock.htmlElement.css({
			position: "absolute"
		});

		return startingBlock.htmlElement;
	}
};

splash.Serializer = {
	splashObjectList: [],
	splashObjectDereferenceList: [],
	splashObjectSerializeId: 1,
	serializeInitial: function(obj) {
		var that = splash.Serializer;
		that.splashObjectSerializeId = 1;
		var returnObject = that.serialize(obj);
		that.serializeCleanup();
		return returnObject;
	},
	serialize: function(obj) {
		var that = splash.Serializer;
		var returnObject = {};

		if(obj instanceof splash.Obj) {
			if(obj.serializeId == 0) {
				that.splashObjectList.push(obj);
				returnObject = obj.serialize(that.splashObjectSerializeId++);
			}
			else {
				returnObject.type = "splashObjectReference";
				returnObject.serializeId = obj.serializeId;
			}
		}
		else if(_.isPlainObject(obj)) {
			var value = {};
			for(var i in obj) {
				value[i] = that.serialize(obj[i]);
			}

			returnObject.type = "plainObject";
			returnObject.value = value;
		}
		else if(_.isArray(obj)) {
			var value = [];
			for(var i in obj) {
				value.push(that.serialize(obj[i]));
			}

			returnObject.type = "array";
			returnObject.value = value;
		}
		else {
			returnObject.type = "primitive";
			returnObject.value = obj;
		}

		return returnObject;
	},
	serializeCleanup: function() {
		var that = splash.Serializer;
		while(that.splashObjectList.length != 0) {
			that.splashObjectList.pop().serializeId = 0;
		}
	},
	deserializeInitial: function(obj) {
		var that = splash.Serializer;
		var returnObject = that.deserialize(obj);
		that.deserializeCleanup();
		return returnObject;
	},
	deserialize: function(obj) {
		var that = splash.Serializer;
		var returnObject;

		if(obj.type == "splashObject") {
			var value = new splash[obj.class](); // We create a default object first, so we get the reference first.
			that.splashObjectList[obj.serializeId] = value;

			splash[obj.class].prototype.deserialize.call(value, obj);
			
			return value;
		}
		else if(obj.type == "splashObjectReference") {
			if(that.splashObjectList[obj.serializeId] == undefined) {
				console.warning("Object Reference Failed!")
				console.warning(obj);
				return;
			}
			return that.splashObjectList[obj.serializeId];
		}
		else if(obj.type == "plainObject") {
			var value = {};
			for(var i in obj) {
				value[i] = that.deserialize(obj[i]);
			}

			return value;
		}
		else if(obj.type == "array") {
			var value = [];
			for(var i in obj.value) {
				value.push(that.deserialize(obj.value[i]));
			}

			return value;
		}
		else { //obj.type == "primitive";
			return obj.value;
		}
	},
	deserializeCleanup: function(obj) {
		splash.Serializer.splashObjectList = [];
	}
}