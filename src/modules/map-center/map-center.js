/**
 * Centers the map around a user-defined location.
 */
(function( $, MMHK, HOMMK ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Map-Center",

	/**
	 * Initializes the module.
	 */
	initialize: function() {
		var self = this;

		$.addCss(
			"#map-center .button div { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Label_Buttons.png') }"
			+ "#DistancesFrameClose { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/SideBar_Shortcuts.gif') }"
		);

		$("<div></div>", {
			id: "map-center"
		})
		.append( "<div id=\"bdist\" class=\"button bdistances cluetip\" title=\"" + $.i18n.get( "map.distance" ) + "\">"
					+ "<div class=\"left\"></div>"
					+ "<div class=\"text\">" + $.i18n.get( "map.distance" ) + "</div>"
					+ "<div class=\"right\"></div>"
				+ "</div>" )
		.append( "<input type=\"text\" size=\"1\" class=\"x\" value=\"" + HOMMK.currentView.regionX + "\" />" )
		.append( "<input type=\"text\" size=\"1\" class=\"y\" value=\"" + HOMMK.currentView.regionY + "\" />" )
		.append( "<div class=\"button bmapcenter\">"
					+ "<div class=\"left\"></div>"
					+ "<div class=\"text\">" + $.i18n.get( "map.center" ) + "</div>"
					+ "<div class=\"right\"></div>"
				+ "</div>" )
		.find( ".bmapcenter" ).click(function() {
			if ( !$( this ).hasClass( "disabled" ) ) {
				self.updateLocation();
			}
		}).end()
		.appendTo( "#WorldMap" + HOMMK.worldMap.elementId + "Content" );

		// keep this module as scope when being called back
		MMHK.hijack( HOMMK.worldMap, "center", this.updateCoordinates, this );
		MMHK.hijack( HOMMK.worldMap, "move", this.updateCoordinates, this );
/*
		$('div.cluetip').attr( "title", this.updateDistancesInfo() ).cluetip({
			splitTitle: '|',
			activation: 'click',
			closePosition: 'title',
			closeText: '<div id="DistancesFrameClose"></div>',
			cluezIndex: 999999
		});
*/
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
		};
																														
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
		
		//Update Distances
		$('div.cluetip').attr( "title", this.updateDistancesInfo() ).cluetip({
			splitTitle: '|',
//			activation: 'click',
			closePosition: 'title',
			closeText: '<div id="DistancesFrameClose"></div>',
			cluezIndex: 999999
		});
	},

	/**
	 * Updates the displayed coordinates with the current ones (from the game).
	 */
	updateDistancesInfo: function() {
		var here = {
			x: HOMMK.currentView.regionX,
			y: HOMMK.currentView.regionY
		};
		var tooltip = $.i18n.get( "dist.title", here.x, here.y ) + "|";
		tooltip += "<div id='DistancesFrame'><div>" + $.i18n.get( "dist.header" ) + "</br></div>";

		tooltip += "<div class=\"distbody\">";		
		// get data for each city
		var cities = HOMMK.elementPool.get( "RegionCity" ).values();
		for ( var i = 0; i < cities.length; i++ ) {
			var city = cities[ i ].content;
			var dist = Math.sqrt( Math.pow( here.x - city.x, 2 ) + Math.pow( here.y - city.y, 2 ) );
			// the world is round
			if ( dist > ( 280 / 2 ) ) {
				dist = dist - 280;
			}
			var armytime = Math.abs( dist ) / 4, herotime = Math.abs( dist )  / 12, merchanttime = Math.abs( dist ) / 10;
			tooltip += "<b>" + city.cityName + "</b> : " 
			+ $.formatNumber( dist ) + $.i18n.get( "dist.units" ) + " ( "
			+ "<b>" + Math.floor ( armytime ) + "h" + Math.floor (( armytime * 60 ) % 60 ) + "m" + Math.floor (( armytime * 3600 ) % 60 ) + "s</b></br>"
			+ " / " + Math.floor ( merchanttime ) + "h" + Math.floor (( merchanttime * 60 ) % 60 ) + "m" + Math.floor (( merchanttime * 3600 ) % 60 ) + "s"
			+ " / " + Math.floor ( herotime ) + "h" + Math.floor (( herotime * 60 ) % 60 ) + "m" + Math.floor (( herotime * 3600 ) % 60 ) + "s"
			+ " )</br>";
		}
		tooltip += "</br></div>";

		tooltip += "<div>" + $.i18n.get( "dist.foot" ) + "</div>";
		tooltip += "</div>";
		return tooltip;
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
