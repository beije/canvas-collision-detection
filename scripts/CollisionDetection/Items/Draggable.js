(function(App, $){
	"use strict";

	App.Draggable = function() {
		this.isDragging = false;
		this.mouseHandler = null;
		this.offsets = {
			x: 0,
			y: 0
		}
		this.initializeDraggable = function(painter, mouseHandler) {
			console.log('Draggable init', this);
			this.mouseHandler = mouseHandler;
			this.setupDragEvents();
		}
		this.setupDragEvents = function() {
			this.mouseHandler.addPositionCallback(this.id, this.updatePosition.bind(this));
			this.mouseHandler.addUpCallback(this.id, this.stopDrag.bind(this));
			this.painter.registerCallback(this.id, this.checkColor.bind(this), 'colorDetecting');
		}

		this.checkColor = function(color) {
			var thisColor = this.solidColors['r']+'-'+this.solidColors['g']+'-'+this.solidColors['b']+'-'+this.solidColors['a'];
			console.log(thisColor.toString());
			console.log(color.toString());
			if(thisColor == color) {
				this.isDragging = true;
				var mousePos = this.mouseHandler.getCurrentPosition();
				this.calculateMouseOffset(mousePos.x, mousePos.y);
			}
		}

		this.calculateMouseOffset = function(mouseX, mouseY) {
			this.offsets = {
				x: (mouseX > this.position.x ? mouseX - this.position.x : this.position.x - mouseX ),
				y: (mouseY > this.position.y ? mouseY - this.position.y : this.position.y - mouseY ),
			}
		}

		this.stopDrag = function() {
			this.isDragging = false;
		}

		this.updatePosition = function(x,y) {

			if(!this.isDragging) return;
			this.position.x = x - this.offsets.x;
			this.position.y = y - this.offsets.y;
		}
	};

})(namespace('CollisionDetection.Items'), jQuery);