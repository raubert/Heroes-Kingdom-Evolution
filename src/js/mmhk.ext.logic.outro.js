
var script = document.createElement( "script" );
script.setAttribute( "type", "text/javascript" );
script.src = chrome.extension.getURL( "mmhk.ext.js" );
document.head.appendChild( script );

})();