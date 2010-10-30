/**
 * Centers the map around a user-defined location.
 */
(function( $, MMHK, HOMMK ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Halt-Info",

	replace: "</div> <div id=\"HaltFrameModelSamePlayer\"",

	/**
	 * Initializes the module
	 */
	initialize: function() {
		var model = HOMMK.elementModelPool.get( "HaltFrame" );
		HOMMK.elementModelPool.obj.HaltFrame = model.replace( this.replace, [
			"<div id=\"HaltFrameModelDestinationInformation\" class=\"hidden\">" + $.i18n.get( "halt.destination" ) + " &nbsp;<a class=\"location\"></a></div>",
			"<div id=\"HaltFrameModelArrivalInformation\" class=\"hidden\">" + $.i18n.get( "halt.arrival" ) + " &nbsp;<span class=\"duration\"></span>&nbsp;(<span class=\"date\"></span>)</div>",
			this.replace
		].join( "" ));

		MMHK.hijack( HOMMK.HaltFrame.prototype, "displayHaltContent", this.update, this );
	},

	/**
	 * Updates the destination and arrival information.
	 * 
	 * @param halt
	 *            the halt object to handle
	 */
	update: function( halt ) {
		var data = HOMMK.elementPool.get( "HeroMove" ).get( halt.selectedHeroMoveId );
		if ( data ) {
			var move = data.content.masterHeroMove;

			$( "#HaltFrame" + halt.elementId + "DestinationInformation" ).removeClass( "hidden" )
				.children( ".location" )
				.text( "[ " + move.x2 + " " + move.y2 + " ]" )
				.unbind( "click" ) // make sure previous handlers are removed
				.click(function() {
					HOMMK.worldMap.center( move.x2, move.y2 );
				});

			var duration = $( "#HaltFrame" + halt.elementId + "ArrivalInformation" ).removeClass( "hidden" )
				.children( ".date" ).text( HOMMK.DateUtils.timestampToString( halt.getLocalTimestampFromRemote( move.endDate ), HOMMK.DATEUTILS_TIME_FORMAT_LOCALE_STRING ) ).end()
				.children( ".duration" );

			var mark = new Date().getTime(); // will be used to make sure we're still dealing with the right halt
			duration.attr( "mark", mark );
			var update = function( duration, mark, force ) {
				if ( force || ( duration.is( ":visible" ) && duration.attr( "mark" ) == mark ) ) {
					duration.text( HOMMK.DateUtils.durationToString( halt.getTimeLeftBeforeRemoteTimestamp( move.endDate ) ) );
					setTimeout( update, 1000, duration, mark, false );
				}
			};
			update( duration, mark, true );
		}
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
