var sendRequest = chrome.extension.sendRequest;

function addScript( filename ) {
	var script = document.createElement( "script" );
	script.setAttribute( "type", "text/javascript" );
	script.src = chrome.extension.getURL( filename );
	document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
}

function addFile( filename ) {
	chrome.extension.sendRequest( {
		module: "main",
		action: "resource",
		data: filename
	}, function(result) {
		var script = document.createElement( "script" );
		script.type = "text/plain";
		script.id = filename.replace( /[^A-Za-z0-9_-]/g, "_" );
		script.innerHTML = result;
		document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
	} );
}

addScript( "mmhk.ext.js" );

