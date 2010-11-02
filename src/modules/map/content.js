var map = document.createElement( "div" );
map.setAttribute( "id", "MapMessageContent" );
MMHK.appendChild( map );

map.addEventListener( "map:save", function() {
	chrome.extension.sendRequest({
		module: "map",
		action: "save",
		data: JSON.parse( map.innerText )
	}, function( data ) {
		map.innerText = data && JSON.stringify( data ) || '';
		var evt = document.createEvent( "Event" );
		evt.initEvent( "map:done", true, true );
		map.dispatchEvent( evt );
	});
});
