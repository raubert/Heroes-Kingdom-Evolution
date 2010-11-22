/**
 * Mines module: adds global 'mines' export button in tasks.
 */
(function( $, MMHK, HOMMK ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Mines",

	/**
	 * Task button labels.
	 */
	button: null,

	/**
	 * Communication message selector.
	 */
	message: "#MinesMessageContent",

	/**
	 * Event prefix.
	 */
	event: "mines",

	/**
	 * Initializes the module.
	 */
	initialize: function() {
		if ( $( "#MMHK-rights" ).text() != "write" ) {
			// not allowed; no need to go further
			return;
		}

		this.button = [ $.i18n.get( "mines.button" ), $.i18n.get( "mines.stop" ) ];

		MMHK.Tasks.setupInterval( this );
	},

	/**
	 * Provides feedback about the current progress.
	 */
	feedback: function( sent, total ) {
		return "<tt>" + ( sent <= 0 ? "-" : sent ) + "</tt> / <tt>" + ( total <= 0 ? "-" : total ) + "</tt> " + $.i18n.get( "mines.spots" );
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
		// only use regions that are in the pool
		var regions = HOMMK.elementPool.get( "RegionMap" ).values();
		for ( var i = 0; i < regions.length; i++ ) {
			var region = regions[ i ].content;
			var cells = region.attachedZoneList;
			var key = region.x + "," + region.y;

			// don't do them twice
			if ( cells && done[ key ] == undefined ) {
				var mines = [];
				for ( var j = 0; j < cells.length; j++ ) {
					if ( cells[ j ].attachedMine ) {
						var mine = cells[ j ].attachedMine;
						mines.push( mine.ressourceEntityTagName );
					}
				}
				// 4 mines or nothing
				if ( mines.length == 4 ) {
					var cell = {
						id: region.id,
						x: region.x,
						y: region.y,
						type: region.type,
						mines: mines
					};
					// there may be a city on this spot
					if ( region.cityName ) {
						cell.type = "city";
						cell.city = {
							player: region.playerId,
							name: region.cityName,
							faction: region.factionEntityTagName.toLowerCase()
						};
					}
					data.values.push( cell );
					done[ key ] = true;
				}
			}
		}
	},

	/**
	 * Stops processing.
	 */
	stop: function() {
		// not used in this module
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
