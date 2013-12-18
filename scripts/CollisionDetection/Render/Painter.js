(function(App, $){
	// Get our prefixed cancelAnimationFrame function
	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
	                           window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

	// Get our prefixed requestAnimationFrame function
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	App.Painter = function() {
		 /*
		 * Initializes the object
		 *
		 * @param canvas (string), Selector for the canvas
		 * @return void.
		 */
		this.initialize = function( canvas ) {
			this.canvasSelector = canvas;
			this.$canvas = $( canvas );

			if(this.$canvas[0] && this.$canvas[0].getContext && this.$canvas[0].getContext('2d')) {
				this.context = this.$canvas[0].getContext( '2d' );
			} else {
				throw "This browser doesn't support canvas";
			}

			
		};

		/*
		 * Our main render loop which runs on every
		 * requestAnimationFrame
		 *
		 * @return void.
		 */
		this.main = function() {
			//
			// DO RENDERING.
			//


			// Generate a new frame id
			this.currentRenderFrame = parseInt( Math.random()*1000 );

			// Rebind the requestAnimationFrame
			if(requestAnimationFrame){
				this.raf = requestAnimationFrame( this.main.bind( this ) );
			} else {
				this.raf = setTimeout( this.main.bind( this ), 20 )
			}
		};

		/*
		 * Starts the painter rendering
		 *
		 * @return void.
		 */
		this.start = function() {
			this.main();
		};

		/*
		 * public function stop()
		 *
		 * Stops the painter from rendering frame
		 *
		 * @return void.
		 */
		this.stop = function() {
			if(this.raf) {
				if(requestAnimationFrame){
					cancelAnimationFrame( this.raf );
					this.raf = null;
				} else {
					clearInterval( this.raf );
					this.raf = null;
				}
			}
		};

		/*
		 * Cleans the canvas from previous frames.
		 *
		 * @return void.
		 */
		this.clearcontext = function() {
			// TODO, fix height width
			this.context.clearRect( 0 , 0 , 10000 , 10000 );
		}

		this.initialize();

		return {
			start: this.start.bind(this),
			stop: this.stop.bind(this)
		};
	}
})(namespace('CollisionDetection.Handlers'), jQuery);