(function(App, $){
	"use strict";

	var Renderable = namespace('CollisionDetection.Render.Renderable');
	var Draggable = namespace('CollisionDetection.Items.Draggable');

	App.Player = function(painter, mouseHandler) {
		this.initialize = function(painter, mouseHandler) {
			this.unpackInhertiance();
			this.loadExternalImage('assets/star.png');
		}

		this.unpackInhertiance = function() {
			Renderable.apply(this);
			Draggable.apply(this);
			this.initializeRenderer(painter);
			this.initializeDraggable( painter, mouseHandler);
		}

		this.initialize(painter, mouseHandler);

		return {
			updatePosition: this.updatePosition.bind(this)
		};
	};
})(namespace('CollisionDetection.Items'), jQuery);