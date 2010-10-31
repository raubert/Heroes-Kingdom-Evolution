(function() {

var HANDLERS = {

	main: function( action, data, callback ) {
		switch ( action ) {
		case "login":
			_logIn( callback );
			break;
		case "rights":
			var conn = getConnection();
			if ( conn != null ) {
				_httpRequest( "GET", conn.url + "/process/status.php", null, function( data ) {
					callback( data && data.rights || "none" );
				});
			} else {
				callback( "none" );
			}
			break;
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
				} catch ( e ) {};
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

};

function getConnection() {
	// check the stored connection parameters
	var connection = localStorage[ "connection" ];
	if ( !connection || connection.url == "" || connection.user == "" || connection.pass == "" ) {
		return null;
	}

	return JSON.parse( connection );
};

function _logIn( callback ) {

	var conn = getConnection();
	if ( conn != null ) {
		_httpRequest( "POST", conn.url + "/process/login.php", {
			username: conn.user,
			password: conn.pass
		}, callback );
	}

};

function sendData( page, data, callback ) {
	var conn = getConnection();
	if ( conn != null ) {
		// connection valid; send data
		_httpRequest( "POST", conn.url + "/process/" + page, data, callback );
		return;
	}

	callback( false );
};

/**
 * Handles requests sent via chrome.extension.sendRequest().
 * 
 * @param request {Object}
 *            data sent in the request
 * @param sender {Object}
 *            origin of the request
 * @param callback {Function}
 *            the method to call when the request completes
 */
function onRequest(request, sender, callback) {
	if ( HANDLERS[ request.module ] ) {
		HANDLERS[ request.module ]( request.action, request.data, callback );
	}
};

// wire up the listener
chrome.extension.onRequest.addListener(onRequest);
