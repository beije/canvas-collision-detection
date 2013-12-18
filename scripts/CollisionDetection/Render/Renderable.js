(function(App, $){
	"use strict";

	App.Renderable = function() {
		this.painter = null;
		this.collisionDetector = null;
		this.canvas = null;
		this.context = null;
		this.id = parseInt(Math.random()*100000);
		this.solid = null;
		this.ready = false;
		this.solidColors = {
			r: parseInt(Math.random()*255),
			g: parseInt(Math.random()*255),
			b: parseInt(Math.random()*255),
			a: 255 // Opacity must be full

		};
		this.size = {
			width: 0,
			height: 0
		};
		this.position = {
			x: parseInt(Math.random()*200),
			y: parseInt(Math.random()*200)
		};

		/*
         * Initializes the object.
         *
         * @return void.
         */
		this.initializeRenderer = function(painter) {
			console.log('Renderable init', this);
			this.painter = painter;
			this.collisionDetector = this.painter.getCollisionDetector();
 			
 			this.canvas = document.createElement('canvas');
			this.context = this.canvas.getContext('2d');

			this.setupRenderEvents();
		}

		/*
         * Sets up our events.
         *
         * @return void.
         */
		this.setupRenderEvents = function() {
			this.painter.registerCallback(this.id, this.animateCallback.bind(this));
		};

		/*
         * Loads an external image.
         *
         * @return void.
         */
		this.loadExternalImage = function(imageUrl) {
			this.imageObj = new Image();
			console.log(this);
			this.imageObj.onload = this.onloadOfExternalImage.bind(this)
			this.imageObj.src = imageUrl;
		};

		/*
         * Handles the external image on load.
         *
         * @return void.
         */
		this.onloadOfExternalImage = function() {
			console.log('ready', this.ready);
			this.context.drawImage(this.imageObj,0,0);

			this.size = {
				width: this.imageObj.width,
				height: this.imageObj.height
			};

			this.pixelMap = this.collisionDetector.buildPixelMap(this.canvas);
			this.ready = true;
			console.log('ready', this.ready);
		};

		/*
		 * private function animateCallback()
		 *
		 * The callback that the painter runs on fram completion
		 * so that we can add a new item in the render queue for 
		 * the painter. The position is updated to the next position
		 * int the calculatedPositions array.
		 *
		 */        
		this.animateCallback = function(id) {
			if(!this.ready) {
				//console.log('not ready', this);
				return;
			} 

			if(this.solid == null) {
				console.log(this.solidColors);
				this.solid = this.painter.createSolid(
					this.canvas,
					this.solidColors['r'],
					this.solidColors['g'],
					this.solidColors['b'],
					this.solidColors['a']
				);
			}

			var pixelMap = {
				pixelMap: this.pixelMap,
				width: this.size.width,
				height: this.size.height,
				x: this.position.x,
				y: this.position.y
			};

			this.painter.addToQueue( 
				this.id,                  // id
				this.canvas,            // Image
				this.solid,            // Image as solid
				this.position.x,  // x position
				this.position.y,  // y position
				1,                        // z layer (or collision layer)
				pixelMap,                  // Pixel data (for collision detection)
				this.collisionDetection.bind(this)
			);
		};

		this.collisionDetection = function() {
			console.log('collide');
		}
	}
})(namespace('CollisionDetection.Render'), jQuery);