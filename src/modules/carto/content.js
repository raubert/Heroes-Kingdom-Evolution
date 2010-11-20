var carto = document.createElement( "div" );
carto.setAttribute( "id", "CartoMessageContent" );
main.appendChild( carto );

carto.addEventListener( "carto:save", function() {
	sendRequest({
		module: "carto",
		action: "save",
		data: JSON.parse( getText( carto ) )
	}, function( data ) {
		setText( carto, data && JSON.stringify( data ) || "" );
		var evt = document.createEvent( "Event" );
		evt.initEvent( "carto:done", true, true );
		carto.dispatchEvent( evt );
	});
}, false);
