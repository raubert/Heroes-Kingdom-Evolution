function getConnection() {
	var connection = {};
	var prefs = mmhkOpts.getPrefs();

	connection.url = mmhkOpts.getUrl( prefs );
	if ( connection.url == null || connection.url == "" ) {
		return null;
	}

	connection.user = mmhkOpts.getUser( prefs );
	if ( connection.user == null || connection.user == "" ) {
		return null;
	}

	var hostname = mmhkOpts.extractHostname( connection.url );
	connection.pass = mmhkOpts.getLogin( mmhkOpts.getLoginManager(), hostname, mmhkOpts.getFormSubmitURL( connection.url ), mmhkOpts.getHttprealm(), connection.user );
	if ( connection.pass == null || connection.pass == "" ) {
		return null;
	}

	return connection;
}

MMHK.extension = {
	onRequest: onRequest
};
