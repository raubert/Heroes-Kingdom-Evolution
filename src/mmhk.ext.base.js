/**
 * Defines the base attributes and methods used by modules.
 */
(function( $ ) {

/**
 * Helper to access HOMMK.
 */
var HOMMK = ( unsafeWindow || window ).HOMMK;

/**
 * Script version; for reference purpose.
 */
MMHK.version = 0.9,

/**
 * Tools container.
 */
MMHK.container = null;

/**
 * Website URL.
 */
MMHK.url = null;

/**
 * All modules will be pushed here.
 */
MMHK.modules = [];

/**
 * Store the HOMMK object so that modules can access it without calling unsafeWindow.
 */
MMHK.HOMMK = HOMMK;

/**
 * Custom click event: in GM, we can't use jQuery's click function.
 * 
 * @param elt
 *            the DOM element to apply the event on
 */
MMHK.click = function( elt ) {
	var evt = document.createEvent( "HTMLEvents" );
	evt.initEvent( "click", true, true ); // event type, bubbling, cancelable
	elt.dispatchEvent( evt );
};

/**
 * Sends some data at the configured location/
 * 
 * @param page
 *            the target page
 * @param data
 *            the data to push
 * @param callback
 *            the response callback
 */
MMHK.sendData = function( page, data, callback ) {
	GM_xmlhttpRequest({
		method: 'POST',
		url: MMHK.url + page,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		data: data,
		onload: callback
	});
};

/**
 * Initializes the registered modules.
 */
function initModules() {
	for ( var i = 0; i < MMHK.modules.length; i++ ) {
		GM_log( "MMHK: initializing '" + MMHK.modules[i].name + "' module..." );
		try {
			MMHK.modules[i].initialize();
			GM_log( "MMHK: '" + MMHK.modules[i].name + "' ready." );
		} catch( e ) {
			GM_log( "MMHK: '" + MMHK.modules[i].name + "' failed!" );
			GM_log( e );
		}
	}
}

$.extend({

	/**
	 * Adds some CSS commands inside the current document.
	 * 
	 * @param css	the string that contains the CSS commands
	 */
	addCss: function( css ) {
		var tmp = document.createElement( "style" );
		tmp.setAttribute( "type", "text/css" );
		if ( tmp.styleSheet ) {
			tmp.styleSheet.cssText = css;
		} else {
			tmp.appendChild( document.createTextNode(css) );
		}
		document.getElementsByTagName( "head" )[0].appendChild( tmp );
	},

	/**
	 * Pretty print for numbers using space as 1K separator.
	 * 
	 * @param number	the value to format
	 */
	formatNumber: function( number ) {
		if ( number < 100 ) {
			return Math.round( number * 100 ) / 100;
		}

		var ret = "" + Math.round( number ), differs = true;
		var rgx = /(\d+)(\d{3})/;
		for ( ; ; ) {
			var rep = ret.replace( rgx, "$1 $2" );
			if ( rep == ret ) {
				break;
			}
			ret = rep;
		}
		return ret;
	},

	durations: [
		{
			limit: null,
			value: 86400
		},
		{
			limit: 24,
			value: 3600
		},
		{
			limit: 60,
			value: 60
		},
		{
			limit: 60,
			value: 1
		}
	],

	getDuration: function( duration ) {
		var time = [];
		// split according to values
		for ( var i = 0; i < $.durations.length; i++ ) {
			time.push( Math.floor( ( i > 0 ? duration % $.durations[ i - 1 ].value : duration ) / $.durations[ i ].value ) );
		}
		// fix according to limits
		for ( var i = $.durations.length - 1; i >= 0; i-- ) {
			if ( time[ i ] == $.durations[ i ].limit ) {
				time[ i - 1 ]++;
				time[ i ] = 0;
			}
		}
		return time;
	},

	formatTime: function( hours, minutes, seconds ) {
		var parts = [ hours, minutes, seconds ], res = "";
		for ( var i = 0; i < parts.length; i++ ) {
			if ( i > 0 ) {
				res += ":";
			}
			if ( parts[ i ] >= 10 ) {
				res += parts[ i ];
			} else if ( parts[ i ] > 0 ) {
				res += "0" + parts[ i ];
			} else {
				res += "00";
			}
		}
		return res;
	},

	formatDuration: function( duration ) {
		if ( ! $.isArray( duration ) ) {
			duration = $.getDuration( duration );
		}
		return ( duration[ 0 ] > 0 ? $.i18n.get( "day", duration[ 0 ] ) + " " : "" ) + $.formatTime( duration[ 1 ], duration[ 2 ], duration[ 3 ] );
	}

});

/**
 * Main function: initializes all registered modules; this has to be called *after* all modules have been registered.
 */
MMHK.initialize = function() {

	var start = new Date().getTime();
	GM_log( "MMHK: launching script initialization..." );

	// deal with locale first
	$.i18n.initialize( HOMMK.locale );
	GM_log( "MMHK: selected language: '" + $.i18n.language + "'..." );

	// append the current time
	$( "#MainMenuContainer>.floatRight:first" ).prepend( "<div id=\"mmhk-ext-time\" class=\"floatLeft mainMenuButton\"></div>" );
	setInterval( function() {
		$( "#mmhk-ext-time" ).text( new Date().toLocaleString() );
	}, 1000 );

	initModules();
	GM_log( "MMHK: initialization complete [" + ( new Date().getTime() - start ) + "ms]." );

};

})( MMHK.jQuery );
