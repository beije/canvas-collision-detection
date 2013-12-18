(function(App, $){
	"use strict";
	
	App.Core = function() {
		this.painter = null;
		this.initialize = function(){
			this.expandCanvas();
			this.painter = new App.Render.Painter('#main-canvas');
			this.mouseHandler = new App.Handlers.MouseHandler('#main-canvas');
			this.mouseHandler.addDownCallback('ObjectPicking', this.painter.mouseDown.bind(this.painter));
			this.star = new App.Items.Star(this.painter, this.mouseHandler);
			this.star2 = new App.Items.Star(this.painter, this.mouseHandler);
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