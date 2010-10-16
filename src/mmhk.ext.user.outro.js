
/**
 * Global initialization.
 */
(function() {

	if ( MMHK.HOMMK.locale === undefined ) {
		// don't start until the game is loaded
		var init = MMHK.HOMMK.initGame;
		MMHK.HOMMK.initGame = function() {
			// init the game first
			init.apply( this, arguments );
			// initialize da shit
			MMHK.initialize();
		};
	} else {
		// game already initialized: no need to wait
		MMHK.initialize();
	}

})();