/**
 * Map module: adds global 'map' export button in tasks.
 */
(function( $, MMHK, HOMMK, undefined ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Map",

	/**
	 * Task button labels.
	 */
	button: [ "map.button", "map.stop" ],

	/**
	 * Communication message selector.
	 */
	message: "#MapMessageContent",

	/**
	 * Event prefix.
	 */
	event: "map",

	/**
	 * Initializes the module.
	 */
	initialize: function() {
		if ( $( "#MMHK-rights" ).text() != "write" ) {
			// not allowed; no need to go further
			return;
		}

		MMHK.Tasks.setupInterval( this );
	},

	/**
	 * Provides feedback about the current progress.
	 */
	feedback: function(sent, total) {
		return "<tt>" + ( sent <= 0 ? "-" : sent ) + "</tt> / <tt>" + ( total <= 0 ? "-" : total ) + "</tt> " + $.i18n.get( "map.regions" );
	},

	/**
	 * Starts processing.
	 */
	start: function() {
		// not used in this module
	},

	/**
	 * Processes the current pool and fills the given parameters accordingly.
	 * 
	 * @param data {Object}
	 *            the object containing the array of values to fill
	 * @param done {Array}
	 *            what has already been done until now
	 */
	process: function( data, done ) {
		// if the map's not ready, don't get data or it may be incomplete
		if ( ( HOMMK.currentView.viewType != 1 && HOMMK.currentView.viewType != 2 ) || HOMMK.currentView.isLoading ) {
			return;
		}

		var regions = HOMMK.elementPool.get( "WorldMap" ).values()[ 0 ];
		// because of the cleanup mecanism, we need to always send the data
		// no cell caching but we still use an origin-related key
		var key = regions.x + ',' + regions.y;
		if ( done[ key ] === undefined ) {
			var size = regions.zoomLevel == 1 ? 34 : 12;
			data.coords = {
				x1: regions.x,
				y1: regions.y,
				x2: regions.x + size,
				y2: regions.y + size
			};
			regions = regions.regionList.elementList;
			for ( var i = 0; i < regions.length; i++ ) {
				data.values.push( this.extractCellData( regions[ i ].content ) );
			}
			done[ key ] = true;
		}
	},

	/**
	 * Extracts the cell settings from the corresponding HOMMK region object.
	 * 
	 * @param region {Object}
	 *            the region to extract data from
	 */
	extractCellData: function( region ) {
		var type = region.type;
		if ( type == "building" && region.rB ) {
			switch ( region.rB.tN ) {
			case "LEARNING_STONE":
				type = "dolmen";
				break;
			case "DWARVEN_TREASURY":
				type = "treasury";
				break;
			case "SPHINX":
				type = "sphinx";
				break;
			}
		}
		var cell = {
			id: region.id,
			x: region.x,
			y: region.y,
			city: region.cN,
			grail: region.hG == 1,
			faction: region.fctN,
			player: {
				id: region.pId,
				name: region.pN
			},
			type: type,
			cells: region.aRL
		};
		if (region._iaId) {
			cell.league = {
				id: region._iaId,
				name: region.iAN,
				color: region._iaCol
			};
		}

		return cell;
	},

	/**
	 * Stops processing.
	 */
	stop: function() {
		// not used in this module
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
