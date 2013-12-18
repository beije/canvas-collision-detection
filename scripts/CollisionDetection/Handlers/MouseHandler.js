(function(App, $){
	"use strict";
	
	App.MouseHandler = function(elementSelector) {
		this.positionCallbacks = {};
		this.downCallbacks = {};
		this.upCallbacks = {};
		this.positions = {
			x: 0,
			y: 0
		};
		this.initialize = function(elementSelector) {
			this.element = $(elementSelector);
			this.addPositionCallback('internalPositionRegister', this.registerCurrentPosition.bind(this));
			this.setupEvents();
		};
		this.setupEvents = function() {
			this.element.on(
				'mousemove',
				this.handleMove.bind(this)
			);
			this.element.on(
				'mousedown',
				this.handleDown.bind(this)
			);
			this.element.on(
				'click',
				this.handleUp.bind(this)
			);
		}
		this.handleMove = function(e) {
			this.updatePositions(e.offsetX, e.offsetY);
		};
		this.handleDown = function(e) {
			this.updateDown(e.offsetX, e.offsetY);
		};
		this.handleUp = function(e) {
			this.updateUp(e.offsetX, e.offsetY);
		};
		this.updatePositions = function(x,y) {
			for(var i in this.positionCallbacks) {
				if(!this.positionCallbacks.hasOwnProperty(i)) continue;
				this.positionCallbacks[i](x,y);
			};
		}
		this.updateDown = function(x,y) {
			for(var i in this.downCallbacks) {
				if(!this.downCallbacks.hasOwnProperty(i)) continue;
				this.downCallbacks[i](x,y);
			};
		}
		this.updateUp = function(x,y) {
			for(var i in this.upCallbacks) {
				if(!this.upCallbacks.hasOwnProperty(i)) continue;
				this.upCallbacks[i](x,y);
			};
		}
		this.addPositionCallback = function(id, callback) {
			if(!id || !callback) {
				throw "Missing parameters.";
			}
			if(typeof callback != "function") {
				throw "Callback is not a function";
			}

			this.positionCallbacks[id] = callback;
		}
		this.addDownCallback = function(id, callback) {
			if(!id || !callback) {
				throw "Missing parameters.";
			}
			if(typeof callback != "function") {
				throw "Callback is not a function";
			}

			this.downCallbacks[id] = callback;
		}
		this.addUpCallback = function(id, callback) {
			if(!id || !callback) {
				throw "Missing parameters.";
			}
			if(typeof callback != "function") {
				throw "Callback is not a function";
			}

			this.upCallbacks[id] = callback;
		}

		this.registerCurrentPosition = function(x,y) {
			this.positions = {
				x: x,
				y: y
			};
		}

		this.getCurrentPosition = function() {
			return this.positions;
		}

		this.initialize(elementSelector);
		return {
			addPositionCallback: this.addPositionCallback.bind(this),
			addDownCallback: this.addDownCallback.bind(this),
			addUpCallback: this.addUpCallback.bind(this),
			getCurrentPosition: this.getCurrentPosition.bind(this)
		};
	}
})(namespace('CollisionDetection.Handlers'), jQuery);