var kingdom = document.createElement( "div" );
kingdom.setAttribute( "id", "KingdomMessageContent" );
main.appendChild( kingdom );

kingdom.addEventListener( "kingdom:save", function() {
	sendRequest({
		module: "kingdom",
		action: "save",
		data: JSON.parse( getText( kingdom ) )
	}, function( data ) {
		setText( kingdom, data && JSON.stringify( data ) || "" );
		var evt = document.createEvent( "Event" );
		evt.initEvent( "kingdom:done", true, true );
		kingdom.dispatchEvent( evt );
	});
}, false);
