(function() {

var spy = document.createElement( "div" );
spy.setAttribute( "id", "SpyMessageContent" );
MMHK.appendChild( spy );

var evt = document.createEvent( "Event" );
evt.initEvent( "spy:done", true, true );

spy.addEventListener( "spy:save", function() {
	chrome.extension.sendRequest({
		module: "spy",
		action: "save",
		data: JSON.parse( spy.innerText )
	}, function( data ) {
		spy.innerText = data && JSON.stringify( data ) || '';
		spy.dispatchEvent( evt );
	});
});

})();