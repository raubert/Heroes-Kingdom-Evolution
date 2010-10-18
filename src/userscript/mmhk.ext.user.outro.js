
/**
 * Global initialization.
 */
(function() {

	if ( MMHK.HOMMK.locale === undefined ) {
		// wait until the game is loaded
		MMHK.hijack( MMHK.HOMMK, "initGame", MMHK.initialize, MMHK );
	} else {
		// game already initialized: no need to wait
		MMHK.initialize();
	}

})();