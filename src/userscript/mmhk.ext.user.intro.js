// ==UserScript==
// @name           MMHK Evolution
// @namespace      http://mightandmagicheroeskingdoms.ubi.com/play
// @description    Copyright 2010, Raphaël Aubert - userscript for MMHK
// @include        http://mightandmagicheroeskingdoms.ubi.com/play*
// @match          http://mightandmagicheroeskingdoms.ubi.com/play*
// @run-at         document-end
// ==/UserScript==

if ( typeof unsafeWindow == "undefined" ) {
	unsafeWindow = window;
}

if ( window.chrome && chrome.extension && !unsafeWindow.HOMMK ) {

	// forced injection inside the page
    var script = document.createElement('script');
    script.setAttribute( "type", "text/javascript" );
    script.src = chrome.extension.getURL( "script.js" );
    document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
    return;

}
