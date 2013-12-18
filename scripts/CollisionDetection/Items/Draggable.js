(function(App, $){
	"use strict";
	
	var Renderable = namespace('CollisionDetection.Render.Renderable');

	App.Draggable = function() {
		this.isDragging = false;
		this.initialize = function(painter) {
			console.log('Draggable init');

			// Because the context is set from another object
			// we need to find the parent below (Renderable).
			this.__proto__.__proto__.initialize(painter);
		}

		this.updatePosition = function(x,y) {
			if(!this.isDragging) return;
			this.position.x = x;
			this.position.y = y;
		}
	};

	App.Draggable.prototype = new Renderable();

})(namespace('CollisionDetection.Items'), jQuery);