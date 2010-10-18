/**
 * Centers the map around a user-defined location.
 */
(function( $ ) {

/**
 * Helper to access HOMMK.
 */
var HOMMK = MMHK.HOMMK;

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Map-Center",

	/**
	 * Initializes the module
	 */
	initialize: function() {
		var self = this;

		$.addCss( "#map-center .button div { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Label_Buttons.gif') }" );

		$("<div></div>", {
			id: "map-center"
		})
		.append( "<input type=\"text\" size=\"1\" class=\"x\" value=\"" + HOMMK.currentView.regionX + "\" />" )
		.append( "<input type=\"text\" size=\"1\" class=\"y\" value=\"" + HOMMK.currentView.regionY + "\" />" )
		.append( "<div class=\"button\">"
					+ "<div class=\"left\"></div>"
					+ "<div class=\"text\">" + $.i18n.get( "map.center" ) + "</div>"
					+ "<div class=\"right\"></div>"
				+ "</div>" )
		.find( ".button" ).click(function() {
			if ( !$( this ).hasClass( "disabled" ) ) {
				self.updateLocation();
			}
		}).end()
		.appendTo( "#WorldMap" + HOMMK.worldMap.elementId + "Content" );

		// keep this module as scope when being called back
		MMHK.hijack( HOMMK.worldMap, "center", this.updateCoordinates, this );
		MMHK.hijack( HOMMK.worldMap, "move", this.updateCoordinates, this );
	},

	/**
	 * When not null, contains the targeted coordinates.
	 */
	target: null,

	/**
	 * Parses and fixes user input coordinate.
	 * 
	 * @param input
	 *            the user input to parse
	 * @return a valid map coordinate
	 */
	getCoordinate: function( input ) {
		return Math.min( Math.max( 1, parseInt( input ) ), HOMMK.worldMap.content._size );
	},

	/**
	 * Action triggered by the 'center' button.
	 */
	updateLocation: function() {
		$( "#map-center" )
			.children( "input" ).attr( "disabled", true ).end()
			.children( ".button" ).addClass( "disabled" );
		this.target = {
			x: this.getCoordinate( $( "#map-center input.x" ).val() ),
			y: this.getCoordinate( $( "#map-center input.y" ).val() )
		};
		// keep this module as scope when being called back
		var self = this;
		HOMMK.worldMap.center( this.target.x, this.target.y, undefined, function() {
			self.updateCoordinates();
		});
	},

	/**
	 * Updates the displayed coordinates with the current ones (from the game).
	 */
	updateCoordinates: function() {
		if ( this.target != null && ( HOMMK.currentView.regionX != this.target.x || HOMMK.currentView.regionY != this.target.y ) ) {
			// manual update will call this due to the hijack; but we may not be looking at the right location yet
			return;
		}

		var self = this;
		MMHK.waitFor(function() {
			return HOMMK.runningJsonRequestCount == 0 && !HOMMK.currentView.isLoading;
		}, function() {
			$( "#map-center input" )
				.filter( ".x" ).val( HOMMK.currentView.regionX ).end()
				.filter( ".y" ).val( HOMMK.currentView.regionY ).end()
				.removeAttr( "disabled" )
				.siblings( ".button" ).removeClass( "disabled" );
			self.target = null;
		});
	}

});

})( MMHK.jQuery );
