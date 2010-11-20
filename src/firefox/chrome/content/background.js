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

					// background script here
					@BACKGROUND
					// content script here
					@CONTENT

					// inject MMHK's script into the page
					var elt = document.createElement( "script" );
					elt.setAttribute( "type", "text/javascript" );
					elt.src = "chrome://mmhk-ext/content/mmhk.ext.js";
					head.appendChild( elt );

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
