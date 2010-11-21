var HANDLERS = {

	main: function( action, data, callback ) {
		try {
			switch ( action ) {
			case "login":
				_logIn( callback );
				break;
			case "rights":
				var conn = getConnection();
				if ( conn != null ) {
					_httpRequest( "GET", conn.url + "/process/status.php", null, callback );
				} else {
					callback( "none" );
				}
				break;
			}
		} catch ( e ) {
			if ( typeof console != "undefined" ) {
				console.log( e );
			}
		}
	}

};

function _httpRequest( type, url, data, callback ) {

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( xhr.readyState == 4 ) {
			if ( xhr.status == 200 ) {
				try {
					callback( JSON.parse( xhr.responseText ) );
					return;
				} catch ( e ) {
					if ( typeof console != "undefined" ) {
						console.log( e );
					}
				}
			}
			callback( null );
		}
	};
	xhr.open( type, url, true );
	xhr.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
	if ( type == "POST" ) {
		var buf = "";
		for ( var name in data ) {
			if ( buf != "" ) {
				buf += "&";
			}
			buf += name;
			buf += "=";
			buf += encodeURIComponent( data[ name ] );
		}
		xhr.send( buf );
	} else {
		xhr.send();
	}

}

function _logIn( callback ) {

	var conn = getConnection();
	if ( conn != null && conn.url != "" ) {
		_httpRequest( "POST", conn.url + "/process/login.php", {
			username: conn.user,
			password: conn.pass
		}, callback );
	} else {
		callback( null );
	}

}

function sendData( page, data, callback ) {
	var conn = getConnection();
	if ( conn != null ) {
		// connection valid; send data
		_httpRequest( "POST", conn.url + "/process/" + page, data, callback );
		return;
	}

	callback( false );
}

/**
 * Handles requests sent via chrome.extension.sendRequest().
 * 
 * @param request {Object}
 *            data sent in the request
 * @param callback {Function}
 *            the method to call when the request completes
 */
function onRequest( request, callback ) {
	if ( HANDLERS[ request.module ] ) {
		HANDLERS[ request.module ]( request.action, request.data, callback );
	}
}
