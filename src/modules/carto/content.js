var carto = document.createElement( "div" );
carto.setAttribute( "id", "CartoMessageContent" );
MMHK.appendChild( carto );

carto.addEventListener( "carto:save", function() {
	chrome.extension.sendRequest({
		module: "carto",
		action: "save",
		data: JSON.parse( carto.innerText )
	}, function( data ) {
		carto.innerText = data && JSON.stringify( data ) || '';
		var evt = document.createEvent( "Event" );
		evt.initEvent( "carto:done", true, true );
		carto.dispatchEvent( evt );
	});
});
