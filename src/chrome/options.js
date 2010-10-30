(function( $ ) {

$(function() {

	$( ".i18n" ).removeClass( "i18n" ).text(function( i, current ) {
		return chrome.i18n.getMessage( current );
	});
	$( "#tabs" ).tabs();
	$( "button" ).button({
		disabled: true
	}).click(function() {
		localStorage[ "connect" ] = JSON.stringify({
			url: $( "#url" ).val(),
			user: $( "#username" ).val(),
			pass: $( "#password" ).val()
		});
		$( "button" ).blur().mouseout().button( "disable" );
	});
	$( "input" ).change(function() {
		$( "button" ).button( "enable" );
	});
	var xhr = new XMLHttpRequest();
	xhr.open( "GET", chrome.extension.getURL( "manifest.json" ), false );
	xhr.onreadystatechange = function() {
		if ( this.readyState == 4 ) {
			var man = JSON.parse( this.responseText );
			$( "#version" ).text( "v" + man.version );
		}
	};
	xhr.send();

	var connect = localStorage[ "connect" ];
	if ( connect ) {
		try {
			connect = JSON.parse( connect );
		} catch ( e ) {
			connect = {};
		}
		$( "#url" ).val( connect.url );
		$( "#username" ).val( connect.user );
		$( "#password" ).val( connect.pass );
	}

});

})( MMHK.jQuery );