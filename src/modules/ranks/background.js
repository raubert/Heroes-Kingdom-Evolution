HANDLERS[ "ranks" ] = function( action, data, callback ) {

	if ( action == "save" ) {
		sendData( "raw.php", {
			type: data.type,
			raw: JSON.stringify( data.values )
		}, callback );
	}

};