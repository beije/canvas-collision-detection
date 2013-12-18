(function(App, $){
	"use strict";

	var Draggable = namespace('CollisionDetection.Items.Draggable');

	App.Player = function(painter, mouseHandler) {
		this.initialize = function(painter, mouseHandler) {
			console.log('Player init', painter, mouseHandler);
			// Initialize parent (Draggable).
			this.__proto__.initialize.call(this, painter, mouseHandler);
			this.loadExternalImage('assets/star.png');
			console.log(this);
		}
		this.initialize(painter, mouseHandler);

		return {
			updatePosition: this.updatePosition.bind(this)
		};
	};
	App.Player.prototype = new Draggable();
})(namespace('CollisionDetection.Items'), jQuery);