(function( $ ) {

function getConnection() {
	var connect = localStorage[ "connection" ];
	if ( !connect ) {
		return null;
	}

	try {
		connect = JSON.parse( connect );
	} catch ( e ) {
		return null;
	}

	if ( connect.pass && connect.pass != "" ) {
		try {
			connect.pass = sjcl.decrypt( "oOzY!pHoN+kyar91", connect.pass );
		} catch ( e ) {}
	}
	return connect;
};

$(function() {

	$( ".i18n" ).removeClass( "i18n" ).text(function( i, current ) {
		return chrome.i18n.getMessage( current );
	});

	$( "#tabs" ).tabs();

	$( "button" ).button({
		disabled: true
	}).click(function() {
		var connect = getConnection() || {};
		connect.url = $( "#url" ).val();
		connect.user = $( "#username" ).val();
		var field = $( "#password" );
		if ( field.val() != field.data( "fake" ) ) {
			// update password
			connect.pass = sjcl.encrypt( "oOzY!pHoN+kyar91", field.val() );
		}
		
		localStorage[ "connection" ] = JSON.stringify( connect );
		$( "button" ).blur().mouseout().button( "disable" );
	});

	$( "input" ).keyup(function() {
		$( "button" ).button( "enable" );
	});

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if ( this.readyState == 4 ) {
			var man = JSON.parse( this.responseText );
			$( "#version" ).text( "v" + man.version );
		}
	};
	xhr.open( "GET", chrome.extension.getURL( "manifest.json" ), false );
	xhr.send();

	var connect = getConnection();
	if ( connect != null ) {
		$( "#url" ).val( connect.url );
		$( "#username" ).val( connect.user );
		var fake = connect.pass.replace( /./g, "*" );
		$( "#password" ).val( fake ).data( "fake", fake );
	}

	$( window ).resize($.throttle( 100, function() {
		$( "#credits" )[ ( $( this ).height() > 840 ? "add" : "remove" ) + "Class" ]( "fixed" );
	})).resize();

});

})( MMHK.jQuery );