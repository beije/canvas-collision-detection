(function(App, $){
	"use strict";
	
	var CollisionDetector = namespace('CollisionDetection.Handlers.CollisionDetector')
	var ColorPicker = namespace('CollisionDetection.Handlers.ColorPicker')

	// Get our prefixed cancelAnimationFrame function
	var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame ||
	                           window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

	// Get our prefixed requestAnimationFrame function
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	App.Painter = function(canvas) {
		this.canvasSelector = '';
		this.colorPicker = null;
		this.context = null;
		this.raf = null;
		this.currentRenderFrame = 0;
		this.finishedFrameCallbacks = [];
		this.preFrameCallbacks = [];
		this.colorDetectingCallbacks = [];
		this.renderQueue = [];
		this.oldRenderQueue = [];
		this.enqueuedImages = [];
		this.collisionDetector = null;

		 /*
		 * Initializes the object
		 *
		 * @param canvas (string), Selector for the canvas
		 * @return void.
		 */
		this.initialize = function(canvas) {
			this.canvasSelector = canvas;

			var canvas = $(canvas);
			if(canvas.length == 0) {
				throw "No canvas detected."
			}

			this.canvas = canvas[0];

			if(this.canvas && this.canvas.getContext && this.canvas.getContext('2d')) {
				this.context = this.canvas.getContext('2d');
			} else {
				throw "This browser doesn't support canvas";
			}

			this.colorPicker = new ColorPicker(this.context);
			this.collisionDetector = new CollisionDetector();
		};

		/*
		 * Our main render loop which runs on every
		 * requestAnimationFrame
		 *
		 * @return void.
		 */
		this.main = function(paintSolid) {
			// Running pre frame render callbacks.
			this.fireCallbacks('preFrameRender', this.currentRenderFrame);


			// Check if we should clear the context
			if(this.renderQueue.length > 0) {
				this.clearcontext();
				this.renderQueue.sort(this.orderByZindex);
			}

			// Render out the queue
			this.renderOutObjects(this.renderQueue, false);

			// Collision detection
            // Loop through the render-que
            for( var i = 0; i < this.renderQueue.length; i++ ) {
                    // Check that the image exists
                    if( !this.renderQueue[i].image ) continue;

                    // No use using this item as source if doesn't have
                    // a callback.
                    if( !this.renderQueue[i].collisionCallback ) continue; 

                    var item = this.renderQueue[i];

                    // Check that we have a pixelmap
                    if( item.pixelMap != null ) {

                            // Go through the queue again
                            for( var n = 0; n < this.renderQueue.length; n++ ) {

                                    // Check that we're not going against the
                                    // same item
                                    if( i === n ) continue;

                                    // Check that we're on the same z-layer
                                    if( this.renderQueue[n].pixelMap != null && this.renderQueue[n].z == item.z ) {

                                            // Detect collision
                                            if( this.collisionDetector.hitTest(item.pixelMap, this.renderQueue[n].pixelMap)) {
                                                    // Fire the collision callback after the function
                                                    // is done with setTimeout.
                                                    if( item.collisionCallback != false ) {
                                                            setTimeout( item.collisionCallback, 0 );
                                                    }
                                                    if( this.renderQueue[n].collisionCallback != false ) {
                                                            setTimeout( this.renderQueue[n].collisionCallback, 0 );
                                                    }
                                            }
                                    }
                            }
                    }
            }

			// Generate a new frame id
			this.currentRenderFrame = parseInt(Math.random()*1000);

			// Rebind the requestAnimationFrame
			if(requestAnimationFrame){
				this.raf = requestAnimationFrame(this.main.bind(this));
			} else {
				this.raf = setTimeout(this.main.bind(this), 20)
			}

			this.resetRenderQueue();

			// Running post frame render callbacks.
			this.fireCallbacks('finishedFrame', this.currentRenderFrame);

		};

		/*
		 * Renders out objects to the canvas.
		 *
		 * @param array renderObjects The objects that should be rendered out.
		 * @param boolean useSolids If we should render out the solid versions.
		 * @return void.
		 */
		this.renderOutObjects = function(renderObjects, useSolids) {
			 // Render out the queue
			for(var i = 0; i < renderObjects.length; i++) {
				if(!renderObjects[i].image) continue; 
				this.context.drawImage(
					(!useSolids ? renderObjects[i].image : renderObjects[i].solid), 
					renderObjects[i].x, 
					renderObjects[i].y
				);
			}
		}

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
					cancelAnimationFrame(this.raf);
					this.raf = null;
				} else {
					clearInterval(this.raf);
					this.raf = null;
				}
			}
		};

		/*
		 * Resets the render queue.
		 *
		 * @return void.
		 */
		this.resetRenderQueue = function() {
			this.oldRenderQueue = this.renderQueue;
			this.renderQueue.length = 0;
		};

		/*
		 * Cleans the canvas from previous frames.
		 *
		 * @return void.
		 */
		this.clearcontext = function() {
			// TODO, fix height width
			this.context.clearRect( 0 , 0 , 10000 , 10000 );
		};

		/*
		 * Order an array with objects on property z
		 *
		 * @param int a The first item to compare.
		 * @param int b The second item to compare.
		 *
		 * @return 
		 */
		this.orderByZindex = function(a, b) {
			return ( a.z < b.z ? -1 : ( a.z > b.z ? 1 : 0 ) );
		};

		/*
		 * Adds item to the render queue, the item will be rendered
		 * at the next frame-rendering. If two items with the same ID
		 * is entered into the queue, only the second one will be rendered.
		 *
		 * @param id (string) A unique identifier for the item
		 * @param image (Object) The item which we wish to render out
		 * @param solid (Object) The item which we wish to render out as a solid
		 * @param x (Int) The x position
		 * @param y (Int) The y position
		 * @param z (Int) (optional) The z position, on what collision layer
		 * @param pixelMap (Object) (optional) The pixel map representation of the object
		 * @param collisionCallback (function) (optional) A callback that fires on collision with other things on the same layer
		 *
		 * @return void.
		 */
        this.addToQueue = function(id, image, solid, x, y, z, pixelMap, collisionCallback) {

			// Set optional flags
			var z = z || 0;
			var collisionCallback = collisionCallback || false;
			var pixelMap = pixelMap || null;

			// Check if item already exists in queue
			// Add or overwrite to queue.
			if( this.enqueuedImages[id] === undefined ) {
				this.renderQueue.push({
					id: id,
					x: x,
					y: y,
					z: z,
					pixelMap: pixelMap,
					collisionCallback: collisionCallback,
					image: image,
					solid: solid
				});
				this.enqueuedImages[id] = this.renderQueue.length-1;
			} else {
					this.renderQueue[ this.enqueuedImages[id] ] = {
					id: id,
					x: x,
					y: y,
					z: z,
					pixelMap: pixelMap,
					collisionCallback: collisionCallback,
					image: image,
					solid: solid
				};                        
			}
        };

		/*
		 * Runs all the callbacks depending on type.
		 *
		 * @param string type The type of callbacks that should be run.
		 * @param mixed args (Optional) Arguments that should be passed on to the callbacks.
		 *
		 * @return void.
		 */
		this.fireCallbacks = function(type, args) {
			var callbacks = [];

			if(!type || type == '') {
				throw "Invalid callback type.";
			}

			if(!args) {
				args = [];
			}

			switch(type) {
				case 'finishedFrame':
					callbacks = this.finishedFrameCallbacks;
				break;
				case 'preFrameRender':
					callbacks = this.preFrameCallbacks;
				break;
				case 'colorDetecting':
					callbacks = this.colorDetectingCallbacks;
				break;
			}

			for(var i = 0; i < callbacks.length; i++) {
				callbacks[i].callback(args);
			}
		}

		/*
		 * Registers a callback for specific event type
		 *
		 * @param string id, the unique id of the callback (so we can unregister it)
		 * @param function callback, the function that should fire on the event
		 * @param string type (optional), the event type
		 *
		 * @return boolean True one success
		 */
        this.registerCallback = function(id, callback, type) {
			if(!id || !callback) {
				throw "Not all parameters where given";
				return false;
			}
			if(typeof callback != 'function') {
				throw "Callback is not a function.";
				return false;
			}

			if(!type) {
				type = 'finishedFrame';
			}

			switch(type) {
				case 'finishedFrame':
					this.finishedFrameCallbacks.push({
						id: id,
						callback: callback
					});

					return true;
				break;
				case 'preFrameRender':
					this.preFrameCallbacks.push({
						id: id,
						callback: callback
					});

					return true;
				break;
				case 'colorDetecting':
					this.colorDetectingCallbacks.push({
						id: id,
						callback: callback
					});

					return true;
				break;
			};

			return false;
		};

		/*
		 * Returns the initialized CollisionDetector.
		 *
		 * @return CollisionDetection.Handlers.CollisionDetector
		 */
		this.getCollisionDetector = function() {
			return this.collisionDetector;
		};

		/*
		 * Renders out the solid versions of all items 
		 * on mousedown event.
		 *
		 * @return void.
		 */
		this.mouseDown = function(x,y) {
			this.clearcontext();
			this.renderOutObjects(this.oldRenderQueue, true);
			var colorData = this.colorPicker.pickColor(x,y);
			var color = colorData['r']+'-'+colorData['g']+'-'+colorData['b']+'-'+colorData['a'];
			this.fireCallbacks('colorDetecting', color);
			this.clearcontext();
			this.renderOutObjects(this.oldRenderQueue);
		}

		this.initialize(canvas);

		return {
			start: this.start.bind(this),
			stop: this.stop.bind(this),
			addToQueue: this.addToQueue.bind(this),
			registerCallback: this.registerCallback.bind(this),
			getCollisionDetector: this.getCollisionDetector.bind(this),
			mouseDown: this.mouseDown.bind(this),
			createSolid: this.colorPicker.createSolid.bind(this.colorPicker)
		};
	}
})(namespace('CollisionDetection.Render'), jQuery);