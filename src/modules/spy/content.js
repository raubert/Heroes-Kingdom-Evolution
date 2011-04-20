var spy = document.createElement( "div" );
spy.setAttribute( "id", "SpyMessageContent" );
main.appendChild( spy );

spy.addEventListener( "spy:save", function() {
	sendRequest({
		module: "spy",
		action: "save",
		data: JSON.parse( getText( spy ) )
	}, function( data ) {
		setText( spy, data && JSON.stringify( data ) || "" );
		var evt = document.createEvent( "Event" );
		evt.initEvent( "spy:done", true, true );
		spy.dispatchEvent( evt );
	});
}, false);

addFile("spy/plain.txt");
addFile("spy/phpBB2.txt");
addFile("spy/phpBB3.txt");

