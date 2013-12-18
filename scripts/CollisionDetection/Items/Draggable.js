(function(App, $){
	"use strict";
	
	var Renderable = namespace('CollisionDetection.Render.Renderable');

	App.Draggable = function() {
		this.setupDraggable = function() {
			console.log('Draggable init');
		}
	};

	App.Draggable.prototype = new Renderable();

})(namespace('CollisionDetection.Items'), jQuery);