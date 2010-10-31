(function() {

var MMHK = document.createElement( "div" );
MMHK.setAttribute( "id", "MMHK" );
document.body.appendChild( MMHK );

var div = document.createElement( "div" );
div.setAttribute( "id", "MMHK-rights" );
MMHK.appendChild( div );

chrome.extension.sendRequest({
	module: "main",
	action: "rights"
}, function( data ) {
	document.getElementById( "MMHK-rights" ).innerText = data || '';
});
