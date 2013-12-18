(function(App, $){
	"use strict";

	App.Renderable = function() {
		this.initialize = function(painter) {
			console.log('Renderable init');
			this.painter = painter;
		}

		this.render = function() {

		};
	}
})(namespace('CollisionDetection.Render'), jQuery);