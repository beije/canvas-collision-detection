(function(App, $){
	"use strict";
	
	App.ColorPicker = function(context) {
		this.context = null;
		this.initialize = function(context){
			this.context = context;
		};

		this.pickColor = function(x,y) {
			var pixel = this.context.getImageData(x,y,1,1);

			return {
				'r': pixel.data[0],
				'g': pixel.data[1],
				'b': pixel.data[2],
				'a': pixel.data[3],
			}
		};

		this.createSolid = function(canvas, r, g, b, a) {
			var newCanvas = document.createElement('canvas');
		
			var context = canvas.getContext("2d");
			var newContext = newCanvas.getContext("2d");

			var imageData = newContext.createImageData(1, 1);
			var color = [r,g,b,a];
			imageData.data.set(color);

			for(var y = 0; y < canvas.height; y++) {
				for(var x = 0; x < canvas.width; x++) {
					var pixel = context.getImageData(x,y,1,1);
					if(pixel.data[3] > 0) {
						newContext.putImageData(imageData,x,y);
					}					
				}
			}
			return newCanvas;
		}

		this.initialize(context);

		return {
			pickColor: this.pickColor.bind(this),
			createSolid: this.createSolid.bind(this)
		}
	}
})(namespace('CollisionDetection.Handlers'), jQuery);