var map = document.createElement( "div" );
map.setAttribute( "id", "MapMessageContent" );
main.appendChild( map );

map.addEventListener( "map:save", function() {
	sendRequest({
		module: "map",
		action: "save",
		data: JSON.parse( getText( map ) )
	}, function( data ) {
		setText( map, data && JSON.stringify( data ) || "" );
		var evt = document.createEvent( "Event" );
		evt.initEvent( "map:done", true, true );
		map.dispatchEvent( evt );
	});
}, false);
