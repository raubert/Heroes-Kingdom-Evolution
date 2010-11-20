var mines = document.createElement( "div" );
mines.setAttribute( "id", "MinesMessageContent" );
main.appendChild( mines );

mines.addEventListener( "mines:save", function() {
	sendRequest({
		module: "mines",
		action: "save",
		data: JSON.parse( getText( mines ) )
	}, function( data ) {
		setText( mines, data && JSON.stringify( data ) || "" );
		var evt = document.createEvent( "Event" );
		evt.initEvent( "mines:done", true, true );
		mines.dispatchEvent( evt );
	});
}, false);
