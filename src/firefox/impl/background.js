function getConnection() {
	var connection = {};

	var manager = Components.classes[ "@mozilla.org/preferences-service;1" ].getService( Components.interfaces.nsIPrefService );
	var prefs = manager.getBranch( "extensions.mmhk." );
	connection.url = prefs.getCharPref( "url" );
	if ( connection.url == null || connection.url == "" ) {
		return null;
	}

	var hostname = "chrome://mmhk";
	var formSubmitURL = null;
	var httprealm = "MMHK User Registration";
	connection.username = null;
	connection.password = null;

	manager = Components.classes[ "@mozilla.org/login-manager;1" ].getService( Components.interfaces.nsILoginManager );
	var logins = manager.findLogins( {}, hostname, formSubmitURL, httprealm );
	for ( var i = 0; i < logins.length; i++ ) {
		// we take the first one
		connection.user = logins[ i ].username;
		connection.pass = logins[ i ].password;
	}

	if ( connection.user == "" || connection.pass == "" ) {
		return null;
	}

	return connection;
}

MMHK.extension = {
	onRequest: onRequest
};
