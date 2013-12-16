/**
 * Contains global functions
 *
 * @file    global.js
 */

/**
 * Makes sure that a namespace exists.
 *
 * @param  {string} namespace The namespace.
 * @return {object}           The namespace objectified.
 */
function namespace(namespace) {
	var object = this, tokens = namespace.split('.'), token;

	while (tokens.length > 0) {
		token = tokens.shift();

		if (typeof object[token] === 'undefined') {
			object[token] = {};
		}

		object = object[token];
	}

	return object;
}

/**
 * Adds bind polyfill.
 */
if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}