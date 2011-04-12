var sendRequest = chrome.extension.sendRequest;

function addScript( filename ) {
	var type = "text/plain";
	if( /\.js$/.test( filename ) ) {
		type = "text/javascript";
	}
	var script = document.createElement( "script" );
	script.setAttribute( "type", type );
	script.src = chrome.extension.getURL( filename );
	script.id = filename;
	document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
}

addScript( "mmhk.ext.js" );

