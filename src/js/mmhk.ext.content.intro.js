(function() {

var MMHK = document.createElement( "div" );
MMHK.setAttribute( "id", "MMHK" );
document.body.appendChild( MMHK );

var div = document.createElement( "div" );
div.setAttribute( "id", "MMHK-rights" );
MMHK.appendChild( div );

chrome.extension.sendRequest({
	module: "main",
	action: "login"
}, function( data ) {
	if ( data && data.status == "success" ) {
		chrome.extension.sendRequest({
			module: "main",
			action: "rights"
		}, function( data ) {
			var div  = document.getElementById( "MMHK-rights" );
			div.innerText = data && data.rights || "none";
			div.className = "";
			if ( data && data.roles ) {
				for ( var i = 0; i < data.roles.length; i++ ) {
					if ( div.className.length > 0 ) {
						div.className += " ";
					}
					div.className += data.roles[ i ];
				}
			}
		});
	} else {
		document.getElementById( "MMHK-rights" ).innerText = "none";
	}
});
