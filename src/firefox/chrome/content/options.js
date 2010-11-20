var mmhkOpts = {

	save: function() {
		try {
			var manager = Components.classes[ "@mozilla.org/preferences-service;1" ].getService( Components.interfaces.nsIPrefService );
			var prefs = manager.getBranch( "extensions.mmhk." );
			prefs.setCharPref( "url", document.getElementById( "url" ).value );

			var hostname = "chrome://mmhk";
			var formSubmitURL = null;
			var httprealm = "MMHK User Registration";
			var username = document.getElementById( "username" ).value;
			var password = null;

			manager = Components.classes[ "@mozilla.org/login-manager;1" ].getService( Components.interfaces.nsILoginManager );
			var logins = manager.findLogins( {}, hostname, formSubmitURL, httprealm );
			for ( var i = 0; i < logins.length; i++ ) {
				if ( logins[ i ].username == username ) {
					password = logins[ i ].password;
				}
			}

			var nsLoginInfo = new Components.Constructor( "@mozilla.org/login-manager/loginInfo;1", Components.interfaces.nsILoginInfo, "init" );
			var loginInfo = new nsLoginInfo( hostname, formSubmitURL, httprealm, username, document.getElementById( "password" ).value, "", "" );
			if ( password == null ) {
				manager.addLogin( loginInfo );
			} else {
				manager.modifyLogin( new nsLoginInfo( hostname, formSubmitURL, httprealm, username, password, "", "" ), loginInfo );
			}
		} catch ( e ) {
			alert( e );
		}
	}

};