var ranks = document.createElement( "div" );
ranks.setAttribute( "id", "RanksMessageContent" );
MMHK.appendChild( ranks );

ranks.addEventListener( "ranks:save", function() {
	chrome.extension.sendRequest({
		module: "ranks",
		action: "save",
		data: JSON.parse( ranks.innerText )
	}, function( data ) {
		ranks.innerText = data && JSON.stringify( data ) || '';
		var evt = document.createEvent( "Event" );
		evt.initEvent( "ranks:done", true, true );
		ranks.dispatchEvent( evt );
	});
});
