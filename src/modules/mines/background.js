HANDLERS[ "mines" ] = function( action, data, callback ) {

	if ( action == "save" ) {
		sendData( "raw.php", {
			type: "mines",
			raw: JSON.stringify( data.values )
		}, callback );
	}

};