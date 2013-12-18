(function(App, $){
	"use strict";
	
	App.Core = function() {
		this.painter = null;
		this.initialize = function(){
			this.painter = new App.Render.Painter('#main-canvas');
			this.player = new App.Items.Player(this.painter);
		}
		
		this.initialize();

		return {};
	}
})(namespace('CollisionDetection'), jQuery);