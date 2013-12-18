(function(App, $){
	"use strict";
	
	var Renderable = namespace('CollisionDetection.Render.Renderable');

	App.Draggable = function() {
		this.initialize = function(painter) {
			console.log('Draggable init');
			this.__proto__.initialize(painter);
		}
	};

	App.Draggable.prototype = new Renderable();

})(namespace('CollisionDetection.Items'), jQuery);