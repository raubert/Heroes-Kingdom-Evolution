var ranks = document.createElement( "div" );
ranks.setAttribute( "id", "RanksMessageContent" );
main.appendChild( ranks );

ranks.addEventListener( "ranks:save", function() {
	sendRequest({
		module: "ranks",
		action: "save",
		data: JSON.parse( getText( ranks ) )
	}, function( data ) {
		setText( ranks, data && JSON.stringify( data ) || "" );
		var evt = document.createEvent( "Event" );
		evt.initEvent( "ranks:done", true, true );
		ranks.dispatchEvent( evt );
	});
}, false);
