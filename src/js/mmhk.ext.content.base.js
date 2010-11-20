function getText( elt ) {
	return elt.innerText || elt.textContent;
}

function setText( elt, text ) {
	if ( elt.innerText != undefined ) {
		elt.innerText = text;
	} else if ( elt.textContent != undefined ) {
		elt.textContent = text;
	}
}

var main = document.createElement( "div" );
main.setAttribute( "id", "MMHK" );
document.getElementsByTagName( "body" )[ 0 ].appendChild( main );

var div = document.createElement( "div" );
div.setAttribute( "id", "MMHK-rights" );
main.appendChild( div );

sendRequest({
	module: "main",
	action: "login"
}, function( data ) {
	if ( data && data.status == "success" ) {
		sendRequest({
			module: "main",
			action: "rights"
		}, function( data ) {
			var div  = document.getElementById( "MMHK-rights" );
			setText( div, data && data.rights || "none" );
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
		setText( document.getElementById( "MMHK-rights" ), "none" );
	}
});
