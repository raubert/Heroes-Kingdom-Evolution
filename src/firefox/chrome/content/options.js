var mmhkOpts = {

	getPrefs: function() {
		return Components.classes[ "@mozilla.org/preferences-service;1" ].getService( Components.interfaces.nsIPrefService ).getBranch( "extensions.mmhk." );
	},

	getUrl: function() {
		return this.getPrefs().getCharPref( "url" );
	},

	hnr: new RegExp( "^([^/]+\://[^/]+)", "im" ),

	extractHostname: function( url ) {
		return url.match( this.hnr )[ 1 ].toString();
	},

	getFormSubmitURL: function( url ) {
		return url + "/process/login.php";
	},

	getHttprealm: function() {
		return null;
	},

	getLoginManager: function() {
		return Components.classes[ "@mozilla.org/login-manager;1" ].getService( Components.interfaces.nsILoginManager );
	},

	getLogin: function( manager, hostname, formSubmitURL, httprealm, username ) {
		var logins = manager.findLogins( {}, hostname, formSubmitURL, httprealm );
		for ( var i = 0; i < logins.length; i++ ) {
			if ( typeof username == "undefined" ) {
				// we take the first one
				return {
					user: logins[ i ].username,
					pass: logins[ i ].password
				};
			} else if ( logins[ i ].username == username ) {
				return logins[ i ].password;
			}
		}
		return null;
	},

	load: function() {
		var url = this.getUrl();

		if ( url != null && url != "" ) {
			document.getElementById( "url" ).value = url;

			var hostname = this.extractHostname( url );
			var login = this.getLogin( this.getLoginManager(), hostname, this.getFormSubmitURL( url ), this.getHttprealm() );

			if ( login != null ) {
				document.getElementById( "username" ).value = login.user;
				document.getElementById( "password" ).value = login.pass;
			}
		}
	},

	save: function() {
		var url = document.getElementById( "url" ).value;
		this.getPrefs().setCharPref( "url", url );

		if ( url != "" ) {
			var username = document.getElementById( "username" ).value;
			if ( username == "" ) {
				// there's nothing we can do
				return;
			}

			var hostname = this.extractHostname( url );
			var manager = this.getLoginManager();
			var formSubmitURL = this.getFormSubmitURL( url );
			var httprealm = this.getHttprealm();
			var password = null;

			var logins = this.getLogin( manager, hostname, formSubmitURL, httprealm, username );

			var nsLoginInfo = new Components.Constructor( "@mozilla.org/login-manager/loginInfo;1", Components.interfaces.nsILoginInfo, "init" );
			var loginInfo = new nsLoginInfo( hostname, formSubmitURL, httprealm, username, document.getElementById( "password" ).value, "", "" );
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

};