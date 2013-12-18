(function(App, $){
	"use strict";
	
	App.Core = function() {
		this.painter = null;
		this.initialize = function(){
			this.painter = new App.Handlers.Painter('#main-canvas');
			console.log('App init');
		}
		
		this.initialize();

		return {};
	}
})(namespace('CollisionDetection'), jQuery);