/**
 * Defines the base attributes and methods used by modules.
 */
(function( $, MMHK, HOMMK, undefined ) {

/**
 * Script version; for reference purpose.
 */
MMHK.version = "@VERSION";

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
 * Store the HOMMK object so that modules can access it easily.
 */
MMHK.HOMMK = HOMMK;

/**
 * Logging utility based on what's available.
 * 
 * @param message
 *            anything you want to log
 */
MMHK.log = typeof console != "undefined" ? function( message ) { console.log( message ); } : function() {};

/**
 * Custom click event: jQuery's default click does not work on handlers setup by HOMMK.
 * 
 * @param elt
 *            the DOM element to apply the event on
 */
MMHK.click = function( elt ) {
	var evt = document.createEvent( "HTMLEvents" );
	evt.initEvent( "click", true, true );
	elt.dispatchEvent( evt );
};

/**
 * Hijacks a specific function execution in order to insert a callback after it.
 * 
 * @param object
 *            the object to hijack
 * @param target
 *            the name of the targeted function
 * @param callback
 *            the callback function to call after the target execution
 * @param scope
 *            the scope for the callback (optional)
 */
MMHK.hijack = function( object, target, callback, scope ) {
	var orig = object[ target ];
	object[ target ] = function() {
		orig && orig.apply( this, arguments );
		callback.call( scope || this, this );
	};
};

/**
 * Waits for a specific condition to be realized before executing a callback.
 * 
 * <p>This method won't wait for more than 10 seconds.</p>
 * 
 * @param condition
 *            the condition to wait for
 * @param callback
 *            the callback to execute when ready
 * @param _limit
 *            for internal use only
 */
MMHK.waitFor = function( condition, callback, _limit ) {
	if ( condition() ) {
		callback( true );
	} else {
		if ( _limit === undefined || _limit > 20 ) {
			_limit = 20;
		}
		if ( _limit > 0 ) {
			setTimeout( MMHK.waitFor, 500, condition, callback, _limit - 1 );
		} else {
			callback( false );
		}
	}
};

/**
 * Initializes the registered modules.
 */
function initModules() {
	for ( var i = 0; i < MMHK.modules.length; i++ ) {
		MMHK.log( "MMHK: initializing '" + MMHK.modules[i].name + "' module..." );
		try {
			MMHK.modules[i].initialize();
			MMHK.log( "MMHK: Module '" + MMHK.modules[i].name + "' ready." );
		} catch( e ) {
			MMHK.log( "MMHK: Module '" + MMHK.modules[i].name + "' failed!" );
			MMHK.log( e );
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
	 * Escapes a string for HTML.
	 * 
	 * @param str
	 *            the string to escape
	 * @param quotes
	 *            when set, double quotes will also be escaped
	 */
	escapeHTML: function ( str, quotes ) {
		var esc = $( "<div></div>" ).text( str ).html();
		if ( quotes ) {
			esc = esc.replace( /"/g, "&quot;" );
		}
		return esc;
	},

	/**
	 * Pretty print for numbers using space as 1K separator.
	 * 
	 * @param number	the value to format
	 */
	formatNumber: function( number ) {
		if ( !number ) {
			return number;
		}

		if ( Math.abs( number ) < 1000 ) {
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
	MMHK.log( "MMHK: launching script v" + MMHK.version + "..." );

	// deal with locale first
	$.i18n.initialize( HOMMK.locale );
	MMHK.log( "MMHK: selected language: '" + $.i18n.language + "'..." );

	// append the current time
	$( ".gameVersion" ).append("<span> | </span>").append( "<span id=\"mmhk-ext-time\"></span>" );
	setInterval( function() {
		var now = new Date();
		$( "#mmhk-ext-time" ).text( $.i18n.toDateString(now) + " " + $.i18n.toTimeString(now) );
	}, 1000 );

	MMHK.log( "MMHK: waiting for rights before proceeding..." );
	MMHK.waitFor(function() {
		return $( "#MMHK-rights" ).text() != "";
	}, function() {
		MMHK.log( "MMHK: running with '" + $( "#MMHK-rights" ).text() + "' permissions." );
		initModules();
		MMHK.log( "MMHK: initialization complete [" + ( new Date().getTime() - start ) + "ms]." );
	}, 10 );

};

})( MMHK.jQuery, MMHK, HOMMK );
