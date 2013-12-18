(function(App, $){
	"use strict";
	
	App.Core = function() {
		this.painter = null;
		this.initialize = function(){
			this.expandCanvas();
			this.painter = new App.Render.Painter('#main-canvas');
			this.mouseHandler = new App.Handlers.MouseHandler('#main-canvas');
			this.player = new App.Items.Player(this.painter, this.mouseHandler);
			this.mouseHandler.addDownCallback('ObjectPicking', this.painter.mouseDown.bind(this.painter));
			this.painter.start();
		}

		this.expandCanvas = function() {
			var canvas = $('#main-canvas');
			var docHeight = $(document.body).innerHeight()-10;
			var docWidth = $(document.body).innerWidth()-10;
			canvas.attr('height', docHeight);
			canvas.attr('width', docWidth);
		}
		
		this.initialize();

		return {};
	}
})(namespace('CollisionDetection'), jQuery);