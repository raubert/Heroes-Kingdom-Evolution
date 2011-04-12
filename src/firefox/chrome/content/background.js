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
						var type = "text/plain";
						if( /\.js$/.test( filename ) ) {
							type = "text/javascript";
						}
						var script = document.createElement( "script" );
						script.setAttribute( "type", type );
						script.src = "chrome://mmhk-ext/content/" + filename;
						script.id = filename;
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
