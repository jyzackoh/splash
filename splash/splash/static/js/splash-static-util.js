var splash = splash || {};

splash.Util = {
	partial: function() {
		var fn = arguments[0];
		Array.prototype.shift.call(arguments);
		var args = Array.prototype.slice.call(arguments);
		return function() {
			var arg = 0;
			for ( var i = 0; i < args.length && arg < arguments.length; i++)
				if ( args[i] === undefined )
					args[i] = arguments[arg++];
			return fn.apply(this, args);
		};
	},
	inherits: function(subClass, superClass) {
		if (_.isFunction(subClass) && _.isFunction(superClass)) {
			subClass.prototype = _.create(superClass.prototype, {'constructor': subClass});
		} else {
			throw new Error('Only class definitions can inherit other class definitions.');
		}
	},
	parseParameters: function(that, parameters) {
		if(_.isPlainObject(parameters)) {
			for(var i in parameters) {
				that[i] = parameters[i];
			}
		}
	}
};
