var div = document.createElement( "div" );
div.setAttribute( "id", "KingdomSave" );
MMHK.appendChild( div );

var kingdomDoneEvent = document.createEvent( "Event" );
kingdomDoneEvent.initEvent( "kingdom.done", true, true );

div.addEventListener( "kingdom.save", function() {
	chrome.extension.sendRequest({
		module: "kingdom",
		action: "save",
		data: div.innerText
	}, function( data ) {
		var div = document.getElementById( "KingdomSave" );
		div.innerText = data && JSON.stringify( data ) || '';
		div.dispatchEvent( kingdomDoneEvent );
	});
});