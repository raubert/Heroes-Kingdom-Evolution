var mines = document.createElement( "div" );
mines.setAttribute( "id", "MinesMessageContent" );
MMHK.appendChild( mines );

mines.addEventListener( "mines:save", function() {
	chrome.extension.sendRequest({
		module: "mines",
		action: "save",
		data: JSON.parse( mines.innerText )
	}, function( data ) {
		mines.innerText = data && JSON.stringify( data ) || '';
		var evt = document.createEvent( "Event" );
		evt.initEvent( "mines:done", true, true );
		mines.dispatchEvent( evt );
	});
});
