HANDLERS[ "map" ] = function( action, data, callback ) {

	if ( action == "save" ) {
		sendData( "raw.php", {
			type: "region",
			coords: JSON.stringify( data.coords ),
			raw: JSON.stringify( data )
		}, callback );
	}

};