function getConnection() {
	// check the stored connection parameters
	var connection = localStorage[ "connection" ];
	if ( !connection ) {
		return null;
	}

	connection = JSON.parse( connection );
	if ( connection.url == "" || connection.user == "" || connection.pass == "" ) {
		return null;
	}

	connection.pass = sjcl.decrypt( "oOzY!pHoN+kyar91", connection.pass );
	return connection;
}

function getForum() {
	// check the stored type of forum
	var forum = localStorage[ "forum" ];
	if ( !forum ) {
		return "phpBB2";
	}

	return forum;
}

// wire up the listener
chrome.extension.onRequest.addListener(function( request, sender, callback ) {
	onRequest( request, callback );
});
