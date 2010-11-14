var battle = document.createElement( "div" );
battle.setAttribute( "id", "BattleMessageContent" );
MMHK.appendChild( battle );

battle.addEventListener( "battle:save", function() {
	chrome.extension.sendRequest({
		module: "battle",
		action: "save",
		data: JSON.parse( battle.innerText )
	}, function( data ) {
		battle.innerText = data && JSON.stringify( data ) || '';
		var evt = document.createEvent( "Event" );
		evt.initEvent( "battle:done", true, true );
		battle.dispatchEvent( evt );
	});
});
