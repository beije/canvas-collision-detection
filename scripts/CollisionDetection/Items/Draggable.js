(function(App, $){
	"use strict";
	
	var Renderable = namespace('CollisionDetection.Render.Renderable');

	App.Draggable = function() {
		this.initialize = function(painter) {
			console.log('Draggable init');

			// Because the context is set from another object
			// we need to find the parent below (Renderable).
			this.__proto__.__proto__.initialize(painter);
		}
	};

	App.Draggable.prototype = new Renderable();

})(namespace('CollisionDetection.Items'), jQuery);