var div = document.createElement( "div" );
div.setAttribute( "id", "KingdomSaveContent" );
MMHK.appendChild( div );

var evt = document.createEvent( "Event" );
evt.initEvent( "kingdom:done", true, true );

div.addEventListener( "kingdom:save", function() {
	chrome.extension.sendRequest({
		module: "kingdom",
		action: "save",
		data: JSON.parse( div.innerText )
	}, function( data ) {
		var div = document.getElementById( "KingdomSaveContent" );
		div.innerText = data && JSON.stringify( data ) || '';
		div.dispatchEvent( evt );
	});
});