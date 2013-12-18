(function(App, $){
	"use strict";

	var Draggable = namespace('CollisionDetection.Items.Draggable');

	App.Player = function(painter) {
		this.initialize = function(painter) {
			console.log('Player init');
			this.__proto__.initialize(painter);
			console.log(this);
		}
		this.initialize(painter);

		return {};
	};
	App.Player.prototype = new Draggable();
})(namespace('CollisionDetection.Items'), jQuery);