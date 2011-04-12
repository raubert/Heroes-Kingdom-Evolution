var regexp = new RegExp( "^http://mightandmagicheroeskingdoms\\.ubi\\.com/play.*" );

window.addEventListener( "load", function() {

	document.getElementById( "appcontent" ).addEventListener( "DOMContentLoaded", function( e ) {

		if ( e.originalTarget.nodeName == "#document" && regexp.test( e.target.defaultView.location.href ) ) {
			// that's the right page
			var document = e.originalTarget, head = document.getElementsByTagName( "head" );

			try {
				if ( head.length > 0 ) {
					head = head[ 0 ];

					var MMHK = {};
					
					function addScript( filename ) {
						var script = document.createElement( "script" );
						script.type = "text/javascript";
						script.src = "chrome://mmhk-ext/content/" + filename;
						document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
					}

					function addFile( filename ) {
						var xhr = new XMLHttpRequest();
						xhr.open( "GET", "chrome://mmhk-ext/content/" + filename, false );
						xhr.send( null );
						var script = document.createElement( "script" );
						script.type = "text/plain";
						script.id = filename.replace( /[^A-Za-z0-9_-]/g, "_" );
						script.innerHTML = xhr.responseText;
						document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
					}


					// background script here
					@BACKGROUND
					// content script here
					@CONTENT

					// inject MMHK's script into the page
					addScript("mmhk.ext.js");

					// inject MMHK's CSS into the page
					elt = document.createElement( "link" );
					elt.setAttribute( "rel", "stylesheet" );
					elt.setAttribute( "type", "text/css" );
					elt.href = "chrome://mmhk-ext/content/mmhk.ext.css";
					head.appendChild( elt );
				}
			} catch ( e ) {
				Components.utils.reportError( e );
			}
		}

	}, true );

}, false );
