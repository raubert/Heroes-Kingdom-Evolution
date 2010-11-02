var kingdom = document.createElement( "div" );
kingdom.setAttribute( "id", "KingdomMessageContent" );
MMHK.appendChild( kingdom );

kingdom.addEventListener( "kingdom:save", function() {
	chrome.extension.sendRequest({
		module: "kingdom",
		action: "save",
		data: JSON.parse( kingdom.innerText )
	}, function( data ) {
		kingdom.innerText = data && JSON.stringify( data ) || '';
		var evt = document.createEvent( "Event" );
		evt.initEvent( "kingdom:done", true, true );
		kingdom.dispatchEvent( evt );
	});
});
