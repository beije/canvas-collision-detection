(function(App, $){
	"use strict";
	
	App.CollisionDetector = function() {
		/*
		 * Initializes the object
		 *
		 * @return void.
		 */
		this.initialize = function() {}

		/*
		 * Checks if two objects collide. First with box-model detection
		 * and then on a per-pixel detection.
		 *
		 * Both source and target objects are expected to look like this:
		 *
		 * {
		 *    x: (Number) current x position,
		 *    y: (Number) current y position,
		 *    width: (Number) object height,
		 *    height: (Number) object width,
		 *    pixelmap: (Object) pixel map object generated from buildPixelMap()
		 * }
		 *
		 * @param source (Object) The source object
		 * @param target (Object) The target object
		 *
		 * @return boolean, true on collision
		 */
		this.hitTest = function(source, target) {
			var hit = false;
			var start = new Date().getTime();

			if(this.boxHitTest(source, target)) {
				if(this.pixelHitTest(source, target)) {
					hit = true;
				}
			}

			var end = new Date().getTime();

			if(hit == true){
				//console.log('detection took: ' + (end - start) + 'ms');
			}

			return hit;
		}

		/*
		 * Checks if two objects collide with box-model detection.
		 *
		 * Both source and target objects are expected to look like this:
		 *
		 * {
		 *    x: (Number) current x position,
		 *    y: (Number) current y position,
		 *    width: (Number) object height,
		 *    height: (Number) object width
		 * }
		 *
		 * @param source (Object) The source object
		 * @param target (Object) The target object
		 *
		 * @return boolean, true on collision
		 */
		this.boxHitTest = function(source, target) {
			return !(
				((source.y + source.height) < (target.y)) ||
				(source.y > (target.y + target.height)) ||
				((source.x + source.width) < target.x) ||
				(source.x > (target.x + target.width)) 
			);
		}

		/*
		 * Checks if two objects collide on a per-pixel detection.
		 *
		 * Both source and target objects are expected to look like this:
		 *
		 * {
		 *    x: (Number) current x position,
		 *    y: (Number) current y position,
		 *    width: (Number) object height,
		 *    height: (Number) object width,
		 *    height: (Number) object width,
		 *    pixelmap: (Object) pixel map object generated from buildPixelMap()
		 * }
		 *
		 * @param source (Object) The source object
		 * @param target (Object) The target object
		 *
		 * @return boolean, true on collision
		 */
		this.pixelHitTest = function(source, target) {

            var top = parseInt(Math.max(source.y, target.y));
            var bottom = parseInt(Math.min(source.y+source.height, target.y+target.height));
            var left = parseInt(Math.max(source.x, target.x));
            var right = parseInt(Math.min(source.x+source.width, target.x+target.width));
            var failed = false;

            for (var y = top; y < bottom; y++) {
                for (var x = left; x < right; x++) {
                	var pixel1 = source.pixelMap.data[ (x - source.x) +"_"+ (y - source.y) ];
                	var pixel2 = target.pixelMap.data[ (x - target.x) +"_"+ (y - target.y) ];

                	if(!pixel1 || !pixel2) {
                		continue;
                	};
                	
                    if (pixel1.pixelData[3] == 255 && pixel2.pixelData[3] == 255) {
                    	
			            var canvas = document.getElementById('main-canvas');
			            var context = canvas.getContext("2d");
						var imageData = context.createImageData(1, 1);
						var color = [255,0,0,255];
						imageData.data.set(color);
						context.putImageData(imageData,(x),(y));
                        failed = true;
                    }
                }
            }

            if(failed){
            	return true;
            }

            return false;
		}

		/*
		 * Creates a pixel map on a canvas image. Everything
		 * with a opacity above 0 is treated as a collision point.
		 * Lower resolution (higher number) will generate a faster
		 * but less accurate map.
		 *
		 *
		 * @param source (Object) The canvas object
		 *
		 * @return object, a pixelMap object
		 */
		this.buildPixelMap = function(source) {
			var resolution = 1;
			var ctx = source.getContext("2d");
			var pixelMap = [];

			for(var y = 0; y < source.height; y++) {
				for(var x = 0; x < source.width; x++) {
					var dataRowColOffset = x+"_"+y;
					var pixel = ctx.getImageData(x,y,resolution,resolution);
					var pixelData = pixel.data;

					pixelMap[dataRowColOffset] = { x:x, y:y, pixelData: pixelData };
					
				}
			}
			return {
				data: pixelMap,
				resolution: resolution
			};
		}

		// Initialize the collider
		this.initialize();

		// Return our outward facing interface.
		return {
			hitTest: this.hitTest.bind(this),
			buildPixelMap: this.buildPixelMap.bind(this)
		};
	}
})(namespace('CollisionDetection.Handlers'), jQuery);