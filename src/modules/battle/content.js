var battle = document.createElement( "div" );
battle.setAttribute( "id", "BattleMessageContent" );
main.appendChild( battle );

battle.addEventListener( "battle:save", function() {
	sendRequest({
		module: "battle",
		action: "save",
		data: JSON.parse( getText( battle ) )
	}, function( data ) {
		setText( battle, data && JSON.stringify( data ) || "" );
		var evt = document.createEvent( "Event" );
		evt.initEvent( "battle:done", true, true );
		battle.dispatchEvent( evt );
	});
}, false);
