var mmhkOpts = {

	getPrefs: function() {
		return Components.classes[ "@mozilla.org/preferences-service;1" ].getService( Components.interfaces.nsIPrefService ).getBranch( "extensions.mmhk." );
	},

	getUrl: function( prefs ) {
		return prefs.getCharPref( "url" );
	},

	getUser: function( prefs ) {
		return prefs.getCharPref( "user" );
	},

	hnr: new RegExp( "^([^/]+\://[^/]+)", "im" ),

	extractHostname: function( url ) {
		return url.match( this.hnr )[ 1 ].toString();
	},

	getFormSubmitURL: function( url ) {
		return this.extractHostname( url );
	},

	getHttprealm: function() {
		return undefined;
	},

	getLoginManager: function() {
		return Components.classes[ "@mozilla.org/login-manager;1" ].getService( Components.interfaces.nsILoginManager );
	},

	getLogin: function( manager, hostname, formSubmitURL, httprealm, username ) {
		var logins = manager.findLogins( {}, hostname, formSubmitURL, httprealm );
		for ( var i = 0; i < logins.length; i++ ) {
			if ( logins[ i ].username == username ) {
				return logins[ i ].password;
			}
		}
		return null;
	},

	load: function() {
		var prefs = this.getPrefs();
		var url = this.getUrl( prefs );

		if ( url != null && url != "" ) {
			document.getElementById( "url" ).value = url;
			var username = this.getUser( prefs );
			document.getElementById( "username" ).value = username;

			var hostname = this.extractHostname( url );
			var password = this.getLogin( this.getLoginManager(), hostname, this.getFormSubmitURL( url ), this.getHttprealm(), username );

			if ( password != null ) {
				document.getElementById( "password" ).value = password;
			}
		}
	},

	save: function() {
		var url = document.getElementById( "url" ).value;
		var username = document.getElementById( "username" ).value;
		var prefs = this.getPrefs();
		prefs.setCharPref( "url", url );
		prefs.setCharPref( "user", username );

		if ( url != "" && username != "" ) {
			var hostname = this.extractHostname( url );
			var manager = this.getLoginManager();
			var formSubmitURL = this.getFormSubmitURL( url );
			var httprealm = this.getHttprealm();
			var password = document.getElementById( "password" ).value;

			if ( password != "" ) {
				var nsLoginInfo = new Components.Constructor( "@mozilla.org/login-manager/loginInfo;1", Components.interfaces.nsILoginInfo, "init" );
				var loginInfo = new nsLoginInfo( hostname, formSubmitURL, httprealm, username, password, "", "" );
				password = this.getLogin( manager, hostname, formSubmitURL, httprealm, username );
				try {
					if ( password == null ) {
						manager.addLogin( loginInfo );
					} else {
						manager.modifyLogin( new nsLoginInfo( hostname, formSubmitURL, httprealm, username, password, "", "" ), loginInfo );
					}
				} catch ( e ) {
					Components.utils.reportError( e );
				}
			}
		}
	}

};