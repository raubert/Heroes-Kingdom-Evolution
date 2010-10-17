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
	name: 'Map-Center',

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
			if ( !$( this ).attr( "disabled" ) ) {
				$( this ).siblings( "input" ).andSelf().attr( "disabled", true );
				self.center();
			}
		}).end()
		.appendTo( "#WorldMap" + HOMMK.worldMap.elementId + "Content" );

		MMHK.hijack( HOMMK.worldMap, "center", this.updateCoordinates );
		MMHK.hijack( HOMMK.worldMap, "move", this.updateCoordinates );
	},

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
	center: function() {
		// make sure the location is updated with the right coordinates: force the update as callback
		HOMMK.worldMap.center( this.getCoordinate( $( "#map-center input.x" ).val() ), this.getCoordinate( $( "#map-center input.y" ).val() ), undefined, this.updateCoordinates );
	},

	/**
	 * Updates the displayed coordinates with the current ones (from the game).
	 */
	updateCoordinates: function() {
		MMHK.waitFor(function() {
			return HOMMK.runningJsonRequestCount == 0 && !HOMMK.currentView.isLoading;
		}, function() {
			$( "#map-center input" )
				.filter( ".x" ).val( HOMMK.currentView.regionX ).end()
				.filter( ".y" ).val( HOMMK.currentView.regionY ).end()
				.siblings( ".button" ).andSelf().removeAttr( "disabled" );
		});
	}

});

})( MMHK.jQuery );
