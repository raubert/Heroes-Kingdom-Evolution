function getConnection() {
	var connection = {};

	connection.url = mmhkOpts.getUrl();
	if ( connection.url == null || connection.url == "" ) {
		return null;
	}

	var hostname = mmhkOpts.extractHostname( connection.url );
	var login = mmhkOpts.getLogin( mmhkOpts.getLoginManager(), hostname, mmhkOpts.getFormSubmitURL( connection.url ), mmhkOpts.getHttprealm() );

	if ( login == null ) {
		return null;
	}

	connection.user = login.user;
	connection.pass = login.pass;

	if ( connection.user == "" || connection.pass == "" ) {
		return null;
	}

	return connection;
}

MMHK.extension = {
	onRequest: onRequest
};
