(function(App, $){
	"use strict";

	var Draggable = namespace('CollisionDetection.Items.Draggable');

	App.Player = function(painter) {
		this.initialize = function(painter) {
			console.log('Player init');
			// Initialize parent (Draggable).
			this.__proto__.initialize.call(this, painter);
			this.loadExternalImage('assets/star.png');
			console.log(this);
		}
		this.initialize(painter);

		return {
			updatePosition: this.updatePosition.bind(this)
		};
	};
	App.Player.prototype = new Draggable();
})(namespace('CollisionDetection.Items'), jQuery);